import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Terminal, Copy, Check } from 'lucide-react';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { APP_COPY } from '../i18n/appCopy';

interface DebugLogsProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  logs: { timestamp: number; data: any }[];
}

export const DebugLogs: React.FC<DebugLogsProps> = ({ isOpen, onClose, onClear, logs }) => {
  const { locale } = useLandingLocale();
  const t = APP_COPY[locale];
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [copiedAll, setCopiedAll] = React.useState(false);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed top-20 right-6 w-[450px] max-h-[75vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-zinc-100">
              <Terminal size={18} className="text-emerald-400" />
              <h2 className="text-sm font-bold tracking-tight">{t.aiLogsTitle}</h2>
            </div>
            <div className="flex items-center space-x-2">
              {logs.length > 0 && (
                <>
                  <button
                    onClick={handleCopyAll}
                    className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors flex items-center space-x-1 text-[10px]"
                    title={t.debugCopyAllTitle}
                  >
                    {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedAll ? t.debugCopied : t.debugCopyAll}</span>
                  </button>
                  <button
                    onClick={onClear}
                    className="p-1.5 hover:bg-red-900/30 hover:text-red-400 rounded-lg text-zinc-400 transition-colors"
                    title={t.debugClear}
                  >
                    <X size={18} />
                  </button>
                </>
              )}
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {logs.length === 0 ? (
              <div className="py-12 text-center text-zinc-600 italic text-sm">
                {t.debugEmpty}
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={log.timestamp} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => handleCopy(JSON.stringify(log.data, null, 2), index)}
                      className="text-[10px] flex items-center space-x-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {copiedIndex === index ? <Check size={10} /> : <Copy size={10} />}
                      <span>{copiedIndex === index ? t.debugCopied : t.debugCopyJson}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-500/90 leading-relaxed max-h-60">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
