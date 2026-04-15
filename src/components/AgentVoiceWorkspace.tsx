import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronRight, ListTodo, Loader2, Sparkles } from 'lucide-react';
import { VoiceRecorder, type TranscriptSubmitMeta } from './VoiceRecorder';
import {
  executeTaskTodoItem,
  refineTranscript,
  runTaskConversationAgent,
  type ConversationAgentTodo,
} from '../lib/gemini';
import type { AgentChatMessage, AgentTodoItem } from '../types';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { APP_COPY } from '../i18n/appCopy';

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

interface AgentVoiceWorkspaceProps {
  sessionKey: string;
  onNewSession: () => void;
  onHome?: () => void;
  onAiLog?: (data: unknown) => void;
}

export const AgentVoiceWorkspace: React.FC<AgentVoiceWorkspaceProps> = ({
  sessionKey,
  onNewSession,
  onHome,
  onAiLog,
}) => {
  const { locale } = useLandingLocale();
  const t = APP_COPY[locale];
  const localeHint = locale === 'en' ? 'en' : 'zh';

  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [todos, setTodos] = useState<AgentTodoItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);
  const [transcriptPolish, setTranscriptPolish] = useState<{
    token: number;
    text: string;
  } | null>(null);

  const messagesRef = useRef<AgentChatMessage[]>([]);
  messagesRef.current = messages;

  const genRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const resetLocal = useCallback(() => {
    setMessages([]);
    setTodos([]);
    setExpandedTodoId(null);
    setTranscriptPolish(null);
    genRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  useEffect(() => {
    resetLocal();
  }, [sessionKey, resetLocal]);

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

  const handleTranscriptComplete = useCallback(
    async (transcript: string, _meta?: TranscriptSubmitMeta) => {
      const raw = transcript.trim();
      if (!raw) return;

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

        const userMsg: AgentChatMessage = {
          id: newId('u'),
          role: 'user',
          content: refined,
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
        setTodos((prev) => mergeTodoItems(plan.todos, prev));
        setExpandedTodoId(null);
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
    [localeHint, onAiLog, t.agentPlanFailed]
  );

  return (
    <div className="flex h-full w-full min-h-0 bg-zinc-50">
      <motion.div
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex min-w-0 flex-1 flex-col border-r border-zinc-200 bg-white"
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-zinc-100 bg-zinc-50/90 px-4 py-3">
          <Sparkles size={18} className="text-zinc-700" aria-hidden />
          <h2 className="text-sm font-semibold text-zinc-900">{t.agentChatTitle}</h2>
          <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            {t.agentConversationAgentBadge}
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && !isProcessing ? (
            <p className="mx-auto mt-12 max-w-lg text-center text-sm leading-relaxed text-zinc-400">
              {t.agentChatEmpty}
            </p>
          ) : null}
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[min(640px,92%)] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-zinc-900 text-white'
                      : 'border border-zinc-200/80 bg-zinc-100 text-zinc-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                </div>
              </div>
            ))}
            {isProcessing ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-500 shadow-sm">
                  <Loader2 className="animate-spin" size={16} />
                  {t.agentPlanning}
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="h-[min(38vh,340px)] shrink-0 border-t border-zinc-200 bg-white">
          <VoiceRecorder
            onTranscriptComplete={handleTranscriptComplete}
            isProcessing={isProcessing}
            onAutoGenerateChange={() => {}}
            onStatusChange={() => {}}
            onReset={() => {}}
            sessionKey={sessionKey}
            transcriptPolish={transcriptPolish}
            onOpenHistory={() => {}}
            onNewSession={onNewSession}
            onHome={onHome}
            generateActionLabel={t.agentSendToAi}
            supplementaryText=""
            onSupplementaryTextChange={() => {}}
            showSupplementary={false}
            showAutoGenerateToggle={false}
            showHistoryButton={false}
            titleOverride={t.agentVoicePanelTitle}
            transcriptPlaceholderOverride={t.agentTranscriptPlaceholder}
          />
        </div>
      </motion.div>

      <motion.aside
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.06 }}
        className="flex h-full w-[min(100%,360px)] min-w-[260px] shrink-0 flex-col border-l border-zinc-200 bg-zinc-50"
        aria-label={t.agentTodoPanelAria}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-zinc-200 bg-white/90 px-4 py-3">
          <ListTodo size={18} className="text-zinc-800" aria-hidden />
          <h2 className="text-sm font-semibold text-zinc-900">{t.agentTodoTitle}</h2>
          <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            {t.agentExecutionAgentBadge}
          </span>
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {todos.length === 0 ? (
            <p className="px-1 py-8 text-center text-xs leading-relaxed text-zinc-400">
              {t.agentTodoEmpty}
            </p>
          ) : (
            todos.map((item) => {
              const open = expandedTodoId === item.id;
              const isRunning = item.status === 'running';
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleTodo(item)}
                    disabled={isRunning}
                    className="flex w-full items-start gap-2 px-3 py-2.5 text-left transition-colors hover:bg-zinc-50 disabled:opacity-70"
                  >
                    <span className="mt-0.5 shrink-0 text-zinc-400" aria-hidden>
                      {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
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
                      <Loader2 className="shrink-0 animate-spin text-zinc-500" size={18} />
                    ) : null}
                  </button>
                  {open ? (
                    <div className="border-t border-zinc-100 bg-zinc-50/80 px-3 py-3">
                      {isRunning ? (
                        <p className="flex items-center gap-2 text-xs text-zinc-500">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          {t.agentExecResultLoading}
                        </p>
                      ) : item.status === 'error' && item.errorMessage ? (
                        <p className="whitespace-pre-wrap text-xs text-red-600">
                          {item.errorMessage}
                        </p>
                      ) : item.result?.trim() ? (
                        <div className="max-h-64 overflow-y-auto">
                          <pre className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-zinc-800">
                            {item.result}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-500">{t.agentExecResultPlaceholder}</p>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </motion.aside>
    </div>
  );
};
