import React, { useCallback } from 'react';
import { FileText, Download, Copy, Check } from 'lucide-react';
import { downloadTextFile } from '../lib/download';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { APP_COPY } from '../i18n/appCopy';

interface DocumentSummaryPanelProps {
  value: string;
  onChange: (next: string) => void;
  isProcessing: boolean;
}

export const DocumentSummaryPanel: React.FC<DocumentSummaryPanelProps> = ({
  value,
  onChange,
  isProcessing,
}) => {
  const { locale } = useLandingLocale();
  const t = APP_COPY[locale];
  const [copied, setCopied] = React.useState(false);

  const handleCopy = useCallback(() => {
    if (!value.trim()) return;
    void navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [value]);

  const stamp = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const downloadMd = () => {
    if (!value.trim()) return;
    const name =
      locale === 'zh' ? `文档总结-${stamp()}.md` : `document-summary-${stamp()}.md`;
    downloadTextFile(name, value, 'text/markdown;charset=utf-8');
  };

  const downloadTxt = () => {
    if (!value.trim()) return;
    const name =
      locale === 'zh' ? `文档总结-${stamp()}.txt` : `document-summary-${stamp()}.txt`;
    downloadTextFile(name, value, 'text/plain;charset=utf-8');
  };

  const empty = !value.trim();
  const showFloatingActions = !empty || isProcessing;

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-zinc-100/80 relative">
      {showFloatingActions ? (
        <div className="pointer-events-none absolute top-4 right-4 z-20 md:top-5 md:right-5">
          <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-zinc-200/80 bg-white/85 p-1 shadow-lg shadow-zinc-900/8 backdrop-blur-md">
            <button
              type="button"
              disabled={empty || isProcessing}
              onClick={handleCopy}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-35"
              title={copied ? t.docCopied : t.docCopy}
              aria-label={copied ? t.docCopied : t.docCopy}
            >
              {copied ? (
                <Check size={18} className="text-emerald-600" />
              ) : (
                <Copy size={18} />
              )}
            </button>
            <button
              type="button"
              disabled={empty || isProcessing}
              onClick={downloadMd}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-35"
              title={t.docMd}
              aria-label={t.docMd}
            >
              <Download size={18} />
            </button>
            <button
              type="button"
              disabled={empty || isProcessing}
              onClick={downloadTxt}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-35"
              title={t.docTxt}
              aria-label={t.docTxt}
            >
              <FileText size={17} />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex-1 min-h-0 p-4 md:p-6 flex flex-col">
        {empty && !isProcessing ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 space-y-4 rounded-2xl border border-dashed border-zinc-200 bg-white/60">
            <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <FileText size={28} className="opacity-25" />
            </div>
            <p className="text-sm text-center max-w-xs leading-relaxed">{t.docEmptyHint}</p>
          </div>
        ) : (
          <div className="relative flex-1 min-h-0 rounded-2xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden flex flex-col">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              readOnly={isProcessing}
              spellCheck={false}
              className="flex-1 min-h-[200px] w-full resize-none px-6 py-5 pr-14 text-[15px] leading-[1.75] text-zinc-800 font-serif placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-900/10 disabled:bg-zinc-50/80"
              placeholder={isProcessing ? t.docPlaceholderLoading : t.docPlaceholder}
            />
          </div>
        )}
      </div>
    </div>
  );
};
