import React from 'react';
import { motion } from 'motion/react';
import { X, Clock, Trash2 } from 'lucide-react';
import { HistoryItem } from '../types';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { APP_COPY } from '../i18n/appCopy';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectItem,
  onDeleteItem
}) => {
  const { locale } = useLandingLocale();
  const t = APP_COPY[locale];
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 border-r border-zinc-200 flex flex-col"
    >
      <div className="p-6 border-bottom border-zinc-100 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-zinc-900">
          <Clock size={20} />
          <h2 className="font-bold tracking-tight">{t.historyTitle}</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 italic text-sm space-y-2">
            <Clock size={32} className="opacity-10" />
            <p>{t.historyEmpty}</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              className="group relative bg-zinc-50 border border-zinc-100 rounded-xl p-4 hover:border-zinc-300 transition-all cursor-pointer"
              onClick={() => onSelectItem(item)}
            >
              <div className="flex flex-col space-y-2">
                <span className="text-[10px] font-mono text-zinc-400">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {item.transcriptDisplay || (item as { transcript?: string }).transcript || ''}
                </p>
                {item.audioDataUrl ? (
                  <audio
                    controls
                    className="w-full mt-2 h-8"
                    src={item.audioDataUrl}
                    preload="metadata"
                  />
                ) : null}
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-tighter line-clamp-2">
                    {item.mindMapData?.label ??
                      (item.documentSummary?.split('\n').find((l) => l.trim())?.replace(/^#+\s*/, '').slice(0, 48) ||
                        t.previewTabDocument)}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-white shadow-sm rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
