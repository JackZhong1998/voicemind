import React from 'react';
import { motion } from 'motion/react';
import { Clock, Trash2, X } from 'lucide-react';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { APP_COPY } from '../i18n/appCopy';
import type { AgentTodoItem } from '../types';

export interface TaskHistoryItem {
  id: string;
  timestamp: number;
  transcriptRaw: string;
  transcriptDisplay: string;
  supplementaryText: string;
  assistantReply: string;
  todos: AgentTodoItem[];
  audioDataUrl: string;
  audioMimeType: string;
}

interface TaskHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: TaskHistoryItem[];
  onSelectItem: (item: TaskHistoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export const TaskHistoryPanel: React.FC<TaskHistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onSelectItem,
  onDeleteItem,
}) => {
  const { locale } = useLandingLocale();
  const t = APP_COPY[locale];

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-zinc-200 bg-white shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 p-6">
        <div className="flex items-center space-x-2 text-zinc-900">
          <Clock size={20} />
          <h2 className="font-bold tracking-tight">{t.historyTitle}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {history.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-sm italic text-zinc-400">
            <Clock size={32} className="opacity-10" />
            <p>{t.historyEmpty}</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="group relative cursor-pointer rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition-all hover:border-zinc-300"
              onClick={() => onSelectItem(item)}
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-zinc-400">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                <p className="line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-zinc-600">
                  {item.transcriptDisplay}
                </p>
                {item.audioDataUrl ? (
                  <audio
                    controls
                    className="mt-2 h-8 w-full"
                    src={item.audioDataUrl}
                    preload="metadata"
                  />
                ) : null}
                <div className="text-[10px] uppercase tracking-wide text-zinc-400">
                  {locale === 'zh'
                    ? `待办 ${item.todos.length} 项`
                    : `${item.todos.length} todos`}
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="absolute right-2 top-2 rounded-lg bg-white p-1.5 text-red-400 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:text-red-600"
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
