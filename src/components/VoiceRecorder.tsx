import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  Pause,
  Play,
  RotateCcw,
  Send,
  Loader2,
  History,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RecordingStatus } from '../types';
import { BrandIcon } from './BrandIcon';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { APP_COPY } from '../i18n/appCopy';

export type TranscriptSubmitMeta = {
  source: 'manual' | 'auto';
  audioBlob: Blob | null;
  audioMimeType: string;
};

interface VoiceRecorderProps {
  onTranscriptComplete: (
    transcript: string,
    meta?: TranscriptSubmitMeta
  ) => void | Promise<void>;
  onLiveTranscriptChange?: (fullText: string) => void;
  isProcessing: boolean;
  onAutoGenerateChange: (enabled: boolean) => void;
  onStatusChange: (status: RecordingStatus) => void;
  onReset?: () => void;
  /** 切换「新会话」时变化，用于清空本地录音与转写 */
  sessionKey: string;
  /** 模型润色后的全文写回展示区（token 每次递增即可触发） */
  transcriptPolish?: { token: number; text: string } | null;
  onOpenHistory: () => void;
  onNewSession: () => void;
  onHome?: () => void;
  /** 主按钮文案（随右侧预览「思维导图 / 文档」切换） */
  generateActionLabel?: string;
  /** 大转写框下方的补充粘贴区，随生成一并写入模型 system prompt */
  supplementaryText: string;
  onSupplementaryTextChange: (value: string) => void;
}

function pickAudioMime(): string {
  const c = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
  ];
  for (const m of c) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return '';
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptComplete,
  onLiveTranscriptChange,
  isProcessing,
  onAutoGenerateChange,
  onStatusChange,
  onReset,
  sessionKey,
  transcriptPolish,
  onOpenHistory,
  onNewSession,
  onHome,
  generateActionLabel,
  supplementaryText,
  onSupplementaryTextChange,
}) => {
  const { locale } = useLandingLocale();
  const t = APP_COPY[locale];
  const autoMark = locale === 'zh' ? '自动' : 'AUTO';
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const statusRef = useRef<RecordingStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isAutoGenerate, setIsAutoGenerate] = useState(false);
  const recognitionRef = useRef<{
    start: () => void;
    stop: () => void;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((ev: Event) => void) | null;
    onerror: ((ev: Event) => void) | null;
    onend: (() => void) | null;
  } | null>(null);
  const lastPolishTokenRef = useRef(0);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const segmentBlobsRef = useRef<Blob[]>([]);
  const chunkPartsRef = useRef<BlobPart[]>([]);
  const recordMimeRef = useRef('');

  useEffect(() => {
    statusRef.current = status;
    onStatusChange(status);
  }, [status, onStatusChange]);

  const flushRecorderSegment = useCallback((): Promise<void> => {
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state === 'inactive') return Promise.resolve();
    return new Promise((resolve) => {
      mr.onstop = () => {
        const blob = new Blob(chunkPartsRef.current, { type: mr.mimeType });
        if (blob.size > 0) segmentBlobsRef.current.push(blob);
        chunkPartsRef.current = [];
        mediaRecorderRef.current = null;
        resolve();
      };
      mr.stop();
    });
  }, []);

  const startRecorderSegment = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    const mime = pickAudioMime();
    recordMimeRef.current = mime || 'audio/webm';
    const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    chunkPartsRef.current = [];
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunkPartsRef.current.push(e.data);
    };
    mr.start(200);
    mediaRecorderRef.current = mr;
  }, []);

  const stopMediaStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const resetLocalCapture = useCallback(async () => {
    await flushRecorderSegment();
    stopMediaStream();
    segmentBlobsRef.current = [];
    recordMimeRef.current = '';
  }, [flushRecorderSegment, stopMediaStream]);

  useEffect(() => {
    if (!transcriptPolish || transcriptPolish.token === lastPolishTokenRef.current) {
      return;
    }
    lastPolishTokenRef.current = transcriptPolish.token;
    setTranscript(transcriptPolish.text);
    setInterimTranscript('');
  }, [transcriptPolish]);

  useEffect(() => {
    void (async () => {
      await resetLocalCapture();
      if (recognitionRef.current && statusRef.current !== 'idle') {
        try {
          recognitionRef.current.stop();
        } catch {
          /* ignore */
        }
      }
      setTranscript('');
      setInterimTranscript('');
      (window as unknown as { _currentTranscript?: string })._currentTranscript = '';
      setStatus('idle');
    })();
  }, [sessionKey, resetLocalCapture]);

  useEffect(() => {
    const W = window as unknown as {
      SpeechRecognition?: new () => {
        start: () => void;
        stop: () => void;
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: ((ev: Event) => void) | null;
        onerror: ((ev: Event) => void) | null;
        onend: (() => void) | null;
      };
      webkitSpeechRecognition?: new () => {
        start: () => void;
        stop: () => void;
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: ((ev: Event) => void) | null;
        onerror: ((ev: Event) => void) | null;
        onend: (() => void) | null;
      };
    };
    const SpeechRecognitionCtor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      console.warn('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = locale === 'en' ? 'en-US' : 'zh-CN';

    recognition.onresult = (event: Event) => {
      const ev = event as unknown as {
        results: { length: number; [i: number]: { 0?: { transcript?: string }; isFinal: boolean } };
      };
      let finalText = '';
      let interimText = '';
      for (let i = 0; i < ev.results.length; i++) {
        const res = ev.results[i];
        const piece = res[0]?.transcript ?? '';
        if (res.isFinal) finalText += piece;
        else interimText += piece;
      }
      setTranscript(finalText);
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: Event) => {
      const err = (event as unknown as { error?: string }).error;
      console.error('Speech recognition error', err);
      if (err === 'not-allowed') {
        alert(APP_COPY[locale].micDenied);
        setStatus('idle');
      }
    };

    recognition.onend = () => {
      if (statusRef.current === 'recording' && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error('Failed to restart recognition:', e);
        }
      }
    };

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };
  }, [locale]);

  useEffect(() => {
    const full = `${transcript}${interimTranscript}`;
    (window as unknown as { _currentTranscript?: string })._currentTranscript = full;
    onLiveTranscriptChange?.(full);
  }, [transcript, interimTranscript, onLiveTranscriptChange]);

  const handleAutoGenerateToggle = () => {
    const newValue = !isAutoGenerate;
    setIsAutoGenerate(newValue);
    onAutoGenerateChange(newValue);
  };

  const startRecording = async () => {
    if (!recognitionRef.current) return;
    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }
      startRecorderSegment();
      recognitionRef.current.start();
      setStatus('recording');
    } catch (e) {
      console.error(e);
      alert(t.micDenied);
    }
  };

  const pauseRecording = async () => {
    await flushRecorderSegment();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setStatus('paused');
  };

  const resetRecording = async () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    await resetLocalCapture();
    setTranscript('');
    setInterimTranscript('');
    (window as unknown as { _currentTranscript?: string })._currentTranscript = '';
    setStatus('idle');
    onReset?.();
  };

  const buildSessionAudioBlob = async (): Promise<{
    blob: Blob | null;
    mime: string;
  }> => {
    await flushRecorderSegment();
    const parts = segmentBlobsRef.current;
    if (parts.length === 0) {
      return { blob: null, mime: recordMimeRef.current || 'audio/webm' };
    }
    const mime = parts[0].type || recordMimeRef.current || 'audio/webm';
    return { blob: new Blob(parts, { type: mime }), mime };
  };

  const handleSubmit = async () => {
    const text = `${transcript}${interimTranscript}`.trim();
    if (!text) return;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    const { blob, mime } = await buildSessionAudioBlob();
    setStatus('idle');
    try {
      await onTranscriptComplete(text, {
        source: 'manual',
        audioBlob: blob,
        audioMimeType: mime,
      });
    } finally {
      setTranscript('');
      setInterimTranscript('');
      (window as unknown as { _currentTranscript?: string })._currentTranscript = '';
      segmentBlobsRef.current = [];
      recordMimeRef.current = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2 min-w-0">
          {onHome ? (
            <button
              type="button"
              onClick={onHome}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors active:scale-95"
              aria-label={t.homeAria}
              title={t.homeAria}
            >
              <BrandIcon size={14} className="text-white" aria-hidden />
            </button>
          ) : null}
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 italic truncate">
            {t.voiceInputTitle}
          </h2>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onOpenHistory}
            className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            title={t.historyAria}
            aria-label={t.historyAria}
          >
            <History size={18} />
          </button>
          <button
            type="button"
            onClick={onNewSession}
            className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            title={t.newSessionAria}
            aria-label={t.newSessionAria}
          >
            <Plus size={20} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-2 min-h-0">
        <div className="flex-1 bg-zinc-50 rounded-xl p-4 border border-zinc-100 overflow-y-auto font-sans text-zinc-800 leading-relaxed relative min-h-[120px]">
          {transcript || interimTranscript ? (
            <div className="whitespace-pre-wrap break-words">
              <span className="text-zinc-800">{transcript}</span>
              {interimTranscript ? (
                <span className="text-zinc-800/90 inline-flex items-baseline flex-wrap gap-x-0.5">
                  <span>{interimTranscript}</span>
                  <motion.span
                    aria-hidden
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="inline-flex space-x-0.5 shrink-0 translate-y-px"
                  >
                    <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                    <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                    <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                  </motion.span>
                </span>
              ) : null}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-300 italic text-sm px-4 text-center">
              {t.transcriptPlaceholder}
            </div>
          )}
        </div>

        <div className="shrink-0 space-y-1.5 pt-1">
          <label
            htmlFor="voicemind-supplementary"
            className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400"
          >
            {t.supplementaryLabel}
          </label>
          <textarea
            id="voicemind-supplementary"
            value={supplementaryText}
            onChange={(e) =>
              onSupplementaryTextChange(e.target.value.slice(0, 12_000))
            }
            placeholder={t.supplementaryPlaceholder}
            rows={4}
            className="w-full resize-y min-h-[88px] max-h-40 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="space-y-4 shrink-0">
        <div className="flex items-center justify-center space-x-4">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.button
                key="start"
                type="button"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-lg"
                aria-label={t.startRecordAria}
              >
                <Mic size={28} />
              </motion.button>
            )}

            {status === 'recording' && (
              <motion.button
                key="pause"
                type="button"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={pauseRecording}
                className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                aria-label={t.pauseAria}
              >
                <Pause size={28} />
              </motion.button>
            )}

            {status === 'paused' && (
              <div key="paused-group" className="flex space-x-4">
                <motion.button
                  type="button"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  onClick={startRecording}
                  className="w-16 h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-lg"
                  aria-label={t.resumeAria}
                >
                  <Play size={28} className="ml-1" />
                </motion.button>
                <motion.button
                  type="button"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  onClick={resetRecording}
                  className="w-16 h-16 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center hover:bg-zinc-300 transition-colors shadow-lg"
                  aria-label={t.resetAria}
                >
                  <RotateCcw size={28} />
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-stretch gap-2">
          <div className="group relative shrink-0">
            <button
              type="button"
              onClick={handleAutoGenerateToggle}
              className={`h-full min-h-[52px] min-w-[52px] shrink-0 rounded-xl border px-2.5 flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                isAutoGenerate
                  ? 'bg-zinc-900 border-zinc-900 text-amber-300 shadow-md shadow-zinc-900/15'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 hover:bg-zinc-50'
              }`}
              aria-pressed={isAutoGenerate}
              title={t.autoGenerateTooltip}
              aria-label={t.autoGenerate}
            >
              <span
                className={`text-[11px] font-black uppercase leading-none tracking-wide ${
                  isAutoGenerate ? 'text-amber-200' : 'text-zinc-500 group-hover:text-zinc-700'
                }`}
              >
                {autoMark}
              </span>
            </button>
            <div
              role="tooltip"
              className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-50 hidden w-max max-w-[min(260px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-zinc-200/90 bg-zinc-900 px-3 py-2.5 text-center text-[11px] leading-snug text-white shadow-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block group-focus-within:opacity-100"
            >
              {t.autoGenerateTooltip}
              <span
                className="absolute left-1/2 top-full -mt-px h-2 w-2 -translate-x-1/2 rotate-45 border border-zinc-200/90 border-t-0 border-l-0 bg-zinc-900"
                aria-hidden
              />
            </div>
          </div>
          <button
            type="button"
            disabled={(!transcript && !interimTranscript) || isProcessing}
            onClick={() => void handleSubmit()}
            className="flex-1 min-w-0 py-4 bg-zinc-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:bg-zinc-200 disabled:text-zinc-400 transition-all active:scale-[0.98]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin shrink-0" size={20} />
                <span className="truncate">{t.generating}</span>
              </>
            ) : (
              <>
                <Send size={20} className="shrink-0" />
                <span className="truncate">{generateActionLabel ?? t.generateMindMap}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
