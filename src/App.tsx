import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/react';
import { VoiceRecorder, type TranscriptSubmitMeta } from './components/VoiceRecorder';
import { MindMap } from './components/MindMap';
import { HistoryPanel } from './components/HistoryPanel';
import { DebugLogs } from './components/DebugLogs';
import { UserMenu } from './components/UserMenu';
import { generateDocumentSummary, generateMindMap, refineTranscript } from './lib/gemini';
import { downloadTextFile } from './lib/download';
import { mindMapToJsonExport, mindMapToMarkdownOutline } from './lib/mindMapOutline';
import { DocumentSummaryPanel } from './components/DocumentSummaryPanel';
import { MindMapNode, HistoryItem, RecordingStatus } from './types';
import { motion } from 'motion/react';
import { Braces, Download, Terminal } from 'lucide-react';
import { useLandingLocale } from './hooks/useLandingLocale';
import { APP_COPY } from './i18n/appCopy';

interface AppProps {
  onHome?: () => void;
}

function historyStorageKey(userId: string | undefined) {
  return `voicemind_history_${userId ?? 'anon'}`;
}

function parseHistory(raw: string): HistoryItem[] {
  try {
    const arr = JSON.parse(raw) as unknown[];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item: unknown) => {
        const o = item && typeof item === 'object' ? (item as Record<string, unknown>) : null;
        if (!o || typeof o.id !== 'string' || typeof o.timestamp !== 'number') {
          return null;
        }
        const mindMapData = o.mindMapData != null ? (o.mindMapData as MindMapNode) : undefined;
        const documentSummary =
          typeof o.documentSummary === 'string' && o.documentSummary.trim() !== ''
            ? o.documentSummary
            : undefined;
        if (!mindMapData && !documentSummary) return null;
        const legacyT = typeof o.transcript === 'string' ? o.transcript : '';
        const entry: HistoryItem = {
          id: o.id,
          timestamp: o.timestamp,
          transcriptRaw: typeof o.transcriptRaw === 'string' ? o.transcriptRaw : legacyT,
          transcriptDisplay:
            typeof o.transcriptDisplay === 'string' ? o.transcriptDisplay : legacyT,
          mindMapData,
          documentSummary,
          audioDataUrl: typeof o.audioDataUrl === 'string' ? o.audioDataUrl : '',
          audioMimeType: typeof o.audioMimeType === 'string' ? o.audioMimeType : 'audio/webm',
        };
        return entry;
      })
      .filter((x): x is HistoryItem => x != null);
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

type TranscriptMeta = TranscriptSubmitMeta | { source: 'auto' };

type PreviewTab = 'mindmap' | 'document';

export default function App({ onHome }: AppProps) {
  const { user } = useUser();
  const { locale } = useLandingLocale();
  const appT = APP_COPY[locale];
  const [previewTab, setPreviewTab] = useState<PreviewTab>('mindmap');
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [documentMarkdown, setDocumentMarkdown] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoGenerateEnabled, setAutoGenerateEnabled] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [aiLogs, setAiLogs] = useState<{ timestamp: number; data: unknown }[]>([]);
  /** 自动刷新导图时按「原始转写」去重，避免与润色后的文本比较出错 */
  const lastAutoRawRef = useRef('');
  const [sessionNonce, setSessionNonce] = useState(0);
  const [transcriptPolish, setTranscriptPolish] = useState<{
    token: number;
    text: string;
  } | null>(null);
  const [supplementaryContext, setSupplementaryContext] = useState('');

  /** 仅随「新会话」变化；勿包含 userId，避免 Clerk 用户对象晚到导致误清空录音区 */
  const sessionKey = String(sessionNonce);

  useEffect(() => {
    const key = historyStorageKey(user?.id);
    let saved = localStorage.getItem(key);
    if (!saved && user?.id) {
      const legacy = localStorage.getItem('voicemind_history');
      if (legacy) {
        try {
          localStorage.setItem(key, legacy);
        } catch {
          /* ignore */
        }
        saved = legacy;
      }
    }
    if (saved) setHistory(parseHistory(saved));
    else setHistory([]);
  }, [user?.id]);

  const persistHistory = useCallback(
    (items: HistoryItem[]) => {
      const key = historyStorageKey(user?.id);
      try {
        localStorage.setItem(key, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to persist history (quota?)', e);
        alert(appT.storageFull);
      }
    },
    [user?.id, appT.storageFull]
  );

  const saveToHistory = useCallback(
    async (
      transcriptRaw: string,
      transcriptDisplay: string,
      output: { mindMapData?: MindMapNode; documentSummary?: string },
      audioBlob: Blob | null,
      audioMimeType: string
    ) => {
      if (!output.mindMapData && !output.documentSummary?.trim()) return;
      let audioDataUrl = '';
      if (audioBlob && audioBlob.size > 0) {
        try {
          audioDataUrl = await blobToDataUrl(audioBlob);
        } catch (e) {
          console.error('audio encode failed', e);
        }
      }
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        transcriptRaw,
        transcriptDisplay,
        mindMapData: output.mindMapData,
        documentSummary: output.documentSummary,
        audioDataUrl,
        audioMimeType: audioMimeType || audioBlob?.type || 'audio/webm',
      };
      setHistory((prev) => {
        const next = [newItem, ...prev].slice(0, 30);
        persistHistory(next);
        return next;
      });
    },
    [persistHistory]
  );

  const handleReset = useCallback(() => {
    setMindMapData(null);
    setDocumentMarkdown('');
    lastAutoRawRef.current = '';
    (window as unknown as { _currentTranscript?: string })._currentTranscript = '';
  }, []);

  const handleNewSession = useCallback(() => {
    handleReset();
    setTranscriptPolish(null);
    setSupplementaryContext('');
    setSessionNonce((n) => n + 1);
  }, [handleReset]);

  const generationRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const autoDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewTabRef = useRef(previewTab);
  previewTabRef.current = previewTab;

  const localeHint = locale === 'en' ? 'en' : 'zh';

  const handleTranscriptComplete = useCallback(
    async (transcript: string, meta?: TranscriptMeta) => {
      const raw = transcript.trim();
      if (!raw) return;

      const source = meta?.source ?? 'auto';
      if (source === 'auto' && raw === lastAutoRawRef.current) return;

      const myGen = (generationRef.current += 1);
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setIsProcessing(true);
      try {
        const refined = await refineTranscript(raw, {
          signal: ac.signal,
          localeHint,
        });
        if (myGen !== generationRef.current) return;

        setTranscriptPolish({ token: Date.now(), text: refined });

        const tab = previewTabRef.current;
        if (tab === 'mindmap') {
          const result = await generateMindMap(refined, {
            signal: ac.signal,
            supplementaryContext,
            localeHint,
          });
          if (myGen !== generationRef.current) return;

          setAiLogs((prev) =>
            [{ timestamp: Date.now(), data: result }, ...prev].slice(0, 10)
          );
          setMindMapData(result.root);
          if (source === 'auto') lastAutoRawRef.current = raw;

          if (source === 'manual' && meta && 'audioBlob' in meta) {
            await saveToHistory(
              raw,
              refined,
              { mindMapData: result.root },
              meta.audioBlob,
              meta.audioMimeType
            );
          }
        } else {
          const markdown = await generateDocumentSummary(refined, {
            signal: ac.signal,
            localeHint,
            supplementaryContext,
          });
          if (myGen !== generationRef.current) return;

          setAiLogs((prev) =>
            [{ timestamp: Date.now(), data: { kind: 'document', markdown } }, ...prev].slice(0, 10)
          );
          setDocumentMarkdown(markdown);
          if (source === 'auto') lastAutoRawRef.current = raw;

          if (source === 'manual' && meta && 'audioBlob' in meta) {
            await saveToHistory(
              raw,
              refined,
              { documentSummary: markdown },
              meta.audioBlob,
              meta.audioMimeType
            );
          }
        }
      } catch (error: unknown) {
        const aborted =
          error instanceof DOMException
            ? error.name === 'AbortError'
            : error instanceof Error && error.name === 'AbortError';
        if (aborted) return;
        if (myGen !== generationRef.current) return;
        console.error('Failed to generate output:', error);
        if (source === 'manual') {
          alert(
            previewTabRef.current === 'mindmap' ? appT.generateFailed : appT.generateDocFailed
          );
        }
      } finally {
        if (myGen === generationRef.current) {
          setIsProcessing(false);
        }
      }
    },
    [
      localeHint,
      supplementaryContext,
      saveToHistory,
      appT.generateFailed,
      appT.generateDocFailed,
    ]
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
        if (!latest) return;
        if (latest === lastAutoRawRef.current) return;
        void handleTranscriptComplete(latest, { source: 'auto' });
      }, 550);
    },
    [autoGenerateEnabled, recordingStatus, handleTranscriptComplete]
  );

  useEffect(() => {
    return () => {
      if (autoDebounceRef.current) clearTimeout(autoDebounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const handleSelectItem = (item: HistoryItem) => {
    setMindMapData(item.mindMapData ?? null);
    setDocumentMarkdown(item.documentSummary ?? '');
    if (item.documentSummary?.trim() && !item.mindMapData) {
      setPreviewTab('document');
    } else {
      setPreviewTab('mindmap');
    }
    setTranscriptPolish({
      token: Date.now(),
      text: item.transcriptDisplay || item.transcriptRaw,
    });
    setIsHistoryOpen(false);
  };

  const exportFileStamp = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const downloadMindMapOutline = () => {
    if (!mindMapData) return;
    const base =
      locale === 'zh' ? `思维导图大纲-${exportFileStamp()}` : `mindmap-outline-${exportFileStamp()}`;
    downloadTextFile(
      `${base}.md`,
      mindMapToMarkdownOutline(mindMapData),
      'text/markdown;charset=utf-8'
    );
  };

  const downloadMindMapJson = () => {
    if (!mindMapData) return;
    const base = locale === 'zh' ? `思维导图-${exportFileStamp()}` : `mindmap-${exportFileStamp()}`;
    downloadTextFile(
      `${base}.json`,
      mindMapToJsonExport(mindMapData),
      'application/json;charset=utf-8'
    );
  };

  const handleDeleteItem = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    persistHistory(updatedHistory);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans">
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectItem={handleSelectItem}
        onDeleteItem={handleDeleteItem}
      />

      <DebugLogs
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
        onClear={() => setAiLogs([])}
        logs={aiLogs}
      />

      <UserMenu onGoHome={() => onHome?.()} />

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-1/3 min-w-[350px] h-full shadow-2xl z-10 relative"
      >
        <VoiceRecorder
          onTranscriptComplete={handleTranscriptComplete}
          onLiveTranscriptChange={onLiveTranscriptChange}
          isProcessing={isProcessing}
          onAutoGenerateChange={setAutoGenerateEnabled}
          onStatusChange={setRecordingStatus}
          onReset={handleReset}
          sessionKey={sessionKey}
          transcriptPolish={transcriptPolish}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onNewSession={handleNewSession}
          onHome={() => onHome?.()}
          generateActionLabel={
            previewTab === 'document' ? appT.generateDocumentSummary : appT.generateMindMap
          }
          supplementaryText={supplementaryContext}
          onSupplementaryTextChange={setSupplementaryContext}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 h-full relative flex flex-col min-h-0"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 px-4 pt-4">
          <div
            className="pointer-events-auto flex items-center gap-0.5 rounded-2xl border border-zinc-200/80 bg-white/85 p-1 shadow-lg shadow-zinc-900/8 backdrop-blur-md"
            role="tablist"
            aria-label={appT.previewTabListAria}
          >
            <button
              type="button"
              role="tab"
              aria-selected={previewTab === 'mindmap'}
              onClick={() => setPreviewTab('mindmap')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                previewTab === 'mindmap'
                  ? 'bg-zinc-900 text-white shadow-md'
                  : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900'
              }`}
            >
              {appT.previewTabMindMap}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={previewTab === 'document'}
              onClick={() => setPreviewTab('document')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                previewTab === 'document'
                  ? 'bg-zinc-900 text-white shadow-md'
                  : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900'
              }`}
            >
              {appT.previewTabDocument}
            </button>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {previewTab === 'mindmap' && mindMapData ? (
              <>
                <button
                  type="button"
                  onClick={downloadMindMapOutline}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/85 text-zinc-700 shadow-lg shadow-zinc-900/8 backdrop-blur-md transition-colors hover:bg-white hover:text-zinc-900"
                  title={appT.exportOutlineMd}
                  aria-label={appT.exportOutlineMd}
                >
                  <Download size={18} />
                </button>
                <button
                  type="button"
                  onClick={downloadMindMapJson}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/85 text-zinc-700 shadow-lg shadow-zinc-900/8 backdrop-blur-md transition-colors hover:bg-white hover:text-zinc-900"
                  title={appT.exportJson}
                  aria-label={appT.exportJson}
                >
                  <Braces size={18} />
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => setIsDebugOpen(true)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-lg shadow-zinc-900/8 backdrop-blur-md transition-all ${
                isDebugOpen
                  ? 'border-emerald-200/80 bg-emerald-50/90 text-emerald-600'
                  : 'border-zinc-200/80 bg-white/85 text-zinc-600 hover:bg-white hover:text-zinc-900'
              }`}
              title={appT.aiLogsTooltip}
              aria-label={appT.aiLogsTooltip}
            >
              <Terminal size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative pt-14">
          {previewTab === 'mindmap' ? (
            <MindMap data={mindMapData} />
          ) : (
            <DocumentSummaryPanel
              value={documentMarkdown}
              onChange={setDocumentMarkdown}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
