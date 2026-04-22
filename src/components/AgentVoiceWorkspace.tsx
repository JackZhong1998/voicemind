import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/react';
import { motion } from 'motion/react';
import { ChevronRight, ListTodo, Loader2 } from 'lucide-react';
import { VoiceRecorder, type TranscriptSubmitMeta } from './VoiceRecorder';
import {
  executeTaskTodoItem,
  refineTranscript,
  runTaskConversationAgent,
  type ConversationAgentTodo,
} from '../lib/gemini';
import type { AgentChatMessage, AgentTodoItem, RecordingStatus } from '../types';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { APP_COPY } from '../i18n/appCopy';
import { TaskHistoryPanel, type TaskHistoryItem } from './TaskHistoryPanel';

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function mergeTodoItems(incoming: ConversationAgentTodo[], prev: AgentTodoItem[]): AgentTodoItem[] {
  const byId = new Map(prev.map((t) => [t.id, t]));
  const byTitle = new Map(prev.map((t) => [t.title.trim(), t]));
  return incoming.map((inc) => {
    const old = byId.get(inc.id) ?? byTitle.get(inc.title.trim());
    if (old && old.title.trim() === inc.title.trim()) {
      return {
        ...old,
        id: inc.id,
        title: inc.title,
        detail: inc.detail,
      };
    }
    if (old && old.id === inc.id) {
      return { ...old, title: inc.title, detail: inc.detail };
    }
    return {
      id: inc.id,
      title: inc.title,
      detail: inc.detail,
      status: 'pending' as const,
    };
  });
}

function toModelTurns(messages: AgentChatMessage[]): { role: 'user' | 'assistant'; content: string }[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

function buildExecutionContext(messages: AgentChatMessage[], locale: 'zh' | 'en'): string {
  const u = locale === 'zh' ? '用户' : 'User';
  const a = locale === 'zh' ? '助手' : 'Assistant';
  return messages
    .slice(-16)
    .map((m) => `${m.role === 'user' ? u : a}: ${m.content}`)
    .join('\n\n');
}

function taskHistoryStorageKey(userId: string | undefined) {
  return `voicemind_task_history_${userId ?? 'anon'}`;
}

function parseTaskHistory(raw: string): TaskHistoryItem[] {
  try {
    const arr = JSON.parse(raw) as unknown[];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => {
        const o = item && typeof item === 'object' ? (item as Record<string, unknown>) : null;
        if (!o || typeof o.id !== 'string' || typeof o.timestamp !== 'number') return null;
        if (typeof o.transcriptDisplay !== 'string' || typeof o.assistantReply !== 'string') return null;
        const todos = Array.isArray(o.todos) ? (o.todos as AgentTodoItem[]) : [];
        return {
          id: o.id,
          timestamp: o.timestamp,
          transcriptRaw: typeof o.transcriptRaw === 'string' ? o.transcriptRaw : o.transcriptDisplay,
          transcriptDisplay: o.transcriptDisplay,
          supplementaryText: typeof o.supplementaryText === 'string' ? o.supplementaryText : '',
          assistantReply: o.assistantReply,
          todos,
          audioDataUrl: typeof o.audioDataUrl === 'string' ? o.audioDataUrl : '',
          audioMimeType: typeof o.audioMimeType === 'string' ? o.audioMimeType : 'audio/webm',
        } satisfies TaskHistoryItem;
      })
      .filter((x): x is TaskHistoryItem => x != null);
  } catch {
    return [];
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

interface AgentVoiceWorkspaceProps {
  sessionKey: string;
  onNewSession: () => void;
  onHome?: () => void;
  onAiLog?: (data: unknown) => void;
  workspaceSwitcher?: React.ReactNode;
}

export const AgentVoiceWorkspace: React.FC<AgentVoiceWorkspaceProps> = ({
  sessionKey,
  onNewSession,
  onHome,
  onAiLog,
  workspaceSwitcher,
}) => {
  const { user } = useUser();
  const { locale } = useLandingLocale();
  const t = APP_COPY[locale];
  const localeHint = locale === 'en' ? 'en' : 'zh';

  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [todos, setTodos] = useState<AgentTodoItem[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);
  const [supplementaryContext, setSupplementaryContext] = useState('');
  const [autoGenerateEnabled, setAutoGenerateEnabled] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [transcriptPolish, setTranscriptPolish] = useState<{
    token: number;
    text: string;
  } | null>(null);

  const messagesRef = useRef<AgentChatMessage[]>([]);
  messagesRef.current = messages;

  const genRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const autoDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAutoRawRef = useRef('');

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (autoDebounceRef.current) clearTimeout(autoDebounceRef.current);
    };
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(taskHistoryStorageKey(user?.id));
    if (!raw) {
      setTaskHistory([]);
      return;
    }
    setTaskHistory(parseTaskHistory(raw));
  }, [user?.id]);

  const persistTaskHistory = useCallback(
    (items: TaskHistoryItem[]) => {
      try {
        localStorage.setItem(taskHistoryStorageKey(user?.id), JSON.stringify(items));
      } catch (e) {
        console.error('Failed to persist task history', e);
        alert(t.storageFull);
      }
    },
    [user?.id, t.storageFull]
  );

  const resetLocal = useCallback(() => {
    setMessages([]);
    setTodos([]);
    setExpandedTodoId(null);
    setTranscriptPolish(null);
    setSupplementaryContext('');
    setAutoGenerateEnabled(false);
    setRecordingStatus('idle');
    setIsHistoryOpen(false);
    lastAutoRawRef.current = '';
    if (autoDebounceRef.current) {
      clearTimeout(autoDebounceRef.current);
      autoDebounceRef.current = null;
    }
    genRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  useEffect(() => {
    resetLocal();
  }, [sessionKey, resetLocal]);

  const saveTaskHistory = useCallback(
    async (
      transcriptRaw: string,
      transcriptDisplay: string,
      assistantReply: string,
      todoItems: AgentTodoItem[],
      audioBlob: Blob | null,
      audioMimeType: string
    ) => {
      let audioDataUrl = '';
      if (audioBlob && audioBlob.size > 0) {
        try {
          audioDataUrl = await blobToDataUrl(audioBlob);
        } catch (e) {
          console.error('task audio encode failed', e);
        }
      }
      const newItem: TaskHistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        transcriptRaw,
        transcriptDisplay,
        supplementaryText: supplementaryContext.trim(),
        assistantReply,
        todos: todoItems,
        audioDataUrl,
        audioMimeType: audioMimeType || audioBlob?.type || 'audio/webm',
      };
      setTaskHistory((prev) => {
        const next = [newItem, ...prev].slice(0, 30);
        persistTaskHistory(next);
        return next;
      });
    },
    [persistTaskHistory, supplementaryContext]
  );

  const handleSelectHistoryItem = useCallback((item: TaskHistoryItem) => {
    setSupplementaryContext(item.supplementaryText);
    setTranscriptPolish({ token: Date.now(), text: item.transcriptDisplay });
    const userMsg: AgentChatMessage = {
      id: newId('u'),
      role: 'user',
      content: item.transcriptDisplay,
      createdAt: item.timestamp,
    };
    const assistantMsg: AgentChatMessage = {
      id: newId('a'),
      role: 'assistant',
      content: item.assistantReply,
      createdAt: item.timestamp + 1,
    };
    setMessages([userMsg, assistantMsg]);
    setTodos(item.todos);
    setExpandedTodoId(null);
    setIsHistoryOpen(false);
  }, []);

  const handleDeleteHistoryItem = useCallback(
    (id: string) => {
      setTaskHistory((prev) => {
        const next = prev.filter((x) => x.id !== id);
        persistTaskHistory(next);
        return next;
      });
    },
    [persistTaskHistory]
  );

  const runTodoExecution = useCallback(
    async (todo: AgentTodoItem) => {
      const msgs = messagesRef.current;
      if (msgs.length === 0) {
        alert(t.agentNoPlanYet);
        return;
      }

      const runId = ++genRef.current;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setTodos((prev) =>
        prev.map((x) =>
          x.id === todo.id ? { ...x, status: 'running' as const, errorMessage: undefined } : x
        )
      );

      try {
        const ctx = buildExecutionContext(msgs, localeHint === 'zh' ? 'zh' : 'en');
        const md = await executeTaskTodoItem(
          {
            conversationContext: ctx,
            todoTitle: todo.title,
            todoDetail: todo.detail,
          },
          { signal: ac.signal, localeHint }
        );
        if (runId !== genRef.current) return;
        setTodos((prev) =>
          prev.map((x) =>
            x.id === todo.id
              ? {
                  ...x,
                  status: 'done' as const,
                  result: md || (localeHint === 'zh' ? '（无输出）' : '(No output)'),
                  errorMessage: undefined,
                }
              : x
          )
        );
        onAiLog?.({ kind: 'execution-agent', todoId: todo.id, markdown: md });
      } catch (e: unknown) {
        const aborted =
          e instanceof DOMException
            ? e.name === 'AbortError'
            : e instanceof Error && e.name === 'AbortError';
        if (aborted) return;
        if (runId !== genRef.current) return;
        const msg = e instanceof Error ? e.message : String(e);
        setTodos((prev) =>
          prev.map((x) =>
            x.id === todo.id ? { ...x, status: 'error' as const, errorMessage: msg } : x
          )
        );
      }
    },
    [localeHint, onAiLog, t.agentNoPlanYet]
  );

  const toggleTodo = useCallback(
    (item: AgentTodoItem) => {
      if (item.status === 'running') return;

      if (expandedTodoId === item.id) {
        setExpandedTodoId(null);
        return;
      }

      setExpandedTodoId(item.id);

      const needsRun =
        item.status === 'pending' ||
        (item.status === 'error' && !item.result?.trim());
      if (needsRun) void runTodoExecution(item);
    },
    [expandedTodoId, runTodoExecution]
  );

  type TranscriptMeta = TranscriptSubmitMeta | { source: 'auto' };

  const handleTranscriptComplete = useCallback(
    async (transcript: string, meta?: TranscriptMeta) => {
      const raw = transcript.trim();
      if (!raw) return;
      const source = meta?.source ?? 'manual';
      if (source === 'auto' && raw === lastAutoRawRef.current) return;

      const runId = ++genRef.current;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setIsProcessing(true);
      try {
        const refined = await refineTranscript(raw, {
          signal: ac.signal,
          localeHint,
        });
        if (runId !== genRef.current) return;

        setTranscriptPolish({ token: Date.now(), text: refined });

        const compositeInput = supplementaryContext.trim()
          ? `${refined}\n\n${localeHint === 'zh' ? '【补充输入】' : '[Supplementary input]'}\n${supplementaryContext.trim()}`
          : refined;

        const userMsg: AgentChatMessage = {
          id: newId('u'),
          role: 'user',
          content: compositeInput,
          createdAt: Date.now(),
        };

        const historyForModel = [...toModelTurns(messagesRef.current), userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        setMessages((prev) => [...prev, userMsg]);

        const plan = await runTaskConversationAgent(historyForModel, {
          signal: ac.signal,
          localeHint,
        });
        if (runId !== genRef.current) return;

        onAiLog?.({ kind: 'conversation-agent', plan });

        const assistantMsg: AgentChatMessage = {
          id: newId('a'),
          role: 'assistant',
          content: plan.reply,
          createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        let nextTodos: AgentTodoItem[] = [];
        setTodos((prev) => {
          nextTodos = mergeTodoItems(plan.todos, prev);
          return nextTodos;
        });
        setExpandedTodoId(null);
        if (source === 'auto') lastAutoRawRef.current = raw;

        if (source === 'manual' && meta && 'audioBlob' in meta) {
          await saveTaskHistory(raw, refined, plan.reply, nextTodos, meta.audioBlob, meta.audioMimeType);
        }
      } catch (e: unknown) {
        const aborted =
          e instanceof DOMException
            ? e.name === 'AbortError'
            : e instanceof Error && e.name === 'AbortError';
        if (aborted) return;
        if (runId !== genRef.current) return;
        console.error(e);
        alert(t.agentPlanFailed);
      } finally {
        if (runId === genRef.current) setIsProcessing(false);
      }
    },
    [localeHint, onAiLog, saveTaskHistory, supplementaryContext, t.agentPlanFailed]
  );

  const onLiveTranscriptChange = useCallback(
    (fullText: string) => {
      if (!autoGenerateEnabled || recordingStatus !== 'recording') return;
      const text = fullText.trim();
      if (!text) return;
      if (autoDebounceRef.current) clearTimeout(autoDebounceRef.current);
      autoDebounceRef.current = setTimeout(() => {
        autoDebounceRef.current = null;
        const latest = (
          (window as unknown as { _currentTranscript?: string })._currentTranscript ?? text
        ).trim();
        if (!latest || latest === lastAutoRawRef.current) return;
        void handleTranscriptComplete(latest, { source: 'auto' });
      }, 550);
    },
    [autoGenerateEnabled, handleTranscriptComplete, recordingStatus]
  );

  const activeTodo = todos.find((x) => x.id === expandedTodoId) ?? null;
  const latestAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant') ?? null;

  return (
    <div className="flex h-full w-full min-h-0 bg-zinc-50 overflow-hidden">
      <TaskHistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={taskHistory}
        onSelectItem={handleSelectHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
      />

      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-1/3 min-w-[350px] h-full shadow-2xl z-10 relative"
      >
        <VoiceRecorder
          onTranscriptComplete={handleTranscriptComplete}
          onLiveTranscriptChange={onLiveTranscriptChange}
          isProcessing={isProcessing}
          onAutoGenerateChange={setAutoGenerateEnabled}
          onStatusChange={setRecordingStatus}
          onReset={() => {
            lastAutoRawRef.current = '';
          }}
          sessionKey={sessionKey}
          transcriptPolish={transcriptPolish}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onNewSession={onNewSession}
          onHome={onHome}
          generateActionLabel={t.agentSendToAi}
          supplementaryText={supplementaryContext}
          onSupplementaryTextChange={setSupplementaryContext}
          titleOverride={t.agentVoicePanelTitle}
          transcriptPlaceholderOverride={t.agentTranscriptPlaceholder}
          headerLeftAddon={workspaceSwitcher}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="flex-1 min-w-0 min-h-0 flex flex-col bg-white"
      >
        <div className="shrink-0 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-900">{t.agentTodoTitle}</h2>
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            {t.agentExecutionAgentBadge}
          </span>
        </div>

        <div className="flex-1 min-h-0 flex">
          <aside
            className="w-[320px] min-w-[280px] max-w-[38%] h-full border-r border-zinc-200 bg-zinc-50/60"
            aria-label={t.agentTodoPanelAria}
          >
            <div className="h-full overflow-y-auto p-3 space-y-2">
              {todos.length === 0 ? (
                <p className="px-1 py-8 text-center text-xs leading-relaxed text-zinc-400">
                  {isProcessing ? t.agentPlanning : t.agentTodoEmpty}
                </p>
              ) : (
                todos.map((item) => {
                  const selected = expandedTodoId === item.id;
                  const isRunning = item.status === 'running';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleTodo(item)}
                      disabled={isRunning}
                      className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all ${
                        selected
                          ? 'border-zinc-900 bg-white shadow-sm'
                          : 'border-zinc-200 bg-white hover:border-zinc-300'
                      } ${isRunning ? 'opacity-80' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-zinc-400" aria-hidden>
                          <ChevronRight size={17} className={selected ? 'rotate-90 transition-transform' : 'transition-transform'} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium leading-snug text-zinc-900">
                            {item.title}
                          </span>
                          {item.detail ? (
                            <span className="mt-0.5 block text-xs text-zinc-500">{item.detail}</span>
                          ) : null}
                          <span className="mt-1 block text-[11px] text-zinc-400">
                            {item.status === 'pending'
                              ? t.agentTodoStatusPending
                              : item.status === 'running'
                                ? t.agentTodoStatusRunning
                                : item.status === 'done'
                                  ? t.agentTodoStatusDone
                                  : t.agentTodoStatusError}
                          </span>
                        </span>
                        {isRunning ? (
                          <Loader2 className="shrink-0 animate-spin text-zinc-500" size={16} />
                        ) : null}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="flex-1 min-w-0 min-h-0 bg-white">
            <div className="h-full overflow-y-auto px-5 py-4">
              {activeTodo ? (
                <>
                  <div className="mb-3 border-b border-zinc-100 pb-3">
                    <h3 className="text-base font-semibold text-zinc-900">{activeTodo.title}</h3>
                    {activeTodo.detail ? (
                      <p className="mt-1 text-sm text-zinc-500">{activeTodo.detail}</p>
                    ) : null}
                  </div>
                  {activeTodo.status === 'running' ? (
                    <p className="flex items-center gap-2 text-sm text-zinc-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.agentExecResultLoading}
                    </p>
                  ) : activeTodo.status === 'error' && activeTodo.errorMessage ? (
                    <pre className="whitespace-pre-wrap break-words rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-600">
                      {activeTodo.errorMessage}
                    </pre>
                  ) : activeTodo.result?.trim() ? (
                    <pre className="whitespace-pre-wrap break-words rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-sans text-sm leading-relaxed text-zinc-800">
                      {activeTodo.result}
                    </pre>
                  ) : (
                    <p className="text-sm text-zinc-500">{t.agentExecResultPlaceholder}</p>
                  )}
                </>
              ) : latestAssistantMessage ? (
                <>
                  <div className="mb-3 border-b border-zinc-100 pb-3">
                    <h3 className="text-base font-semibold text-zinc-900">{t.agentChatTitle}</h3>
                    <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">
                      {t.agentConversationAgentBadge}
                    </p>
                  </div>
                  <pre className="whitespace-pre-wrap break-words rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-sans text-sm leading-relaxed text-zinc-800">
                    {latestAssistantMessage.content}
                  </pre>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="max-w-md text-center text-sm leading-relaxed text-zinc-400">
                    {isProcessing ? t.agentPlanning : t.agentChatEmpty}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};
