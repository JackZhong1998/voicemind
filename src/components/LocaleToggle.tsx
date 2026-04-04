import React from 'react';
import type { LandingLocale } from '../i18n/landingCopy';

type Props = {
  locale: LandingLocale;
  onChange: (locale: LandingLocale) => void;
  /** 用于窄面板（如用户菜单），避免占满整行 */
  variant?: 'default' | 'compact';
};

export const LocaleToggle: React.FC<Props> = ({
  locale,
  onChange,
  variant = 'default',
}) => {
  const compact = variant === 'compact';
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-full border border-zinc-200 bg-zinc-50 p-0.5 font-semibold tracking-wide ${
        compact ? 'text-[10px]' : 'text-[11px]'
      }`}
      role="group"
      aria-label={locale === 'zh' ? '切换语言' : 'Language'}
    >
      <button
        type="button"
        onClick={() => onChange('zh')}
        className={`rounded-full transition-colors ${
          compact ? 'px-2 py-1' : 'px-2.5 py-1.5 md:px-3'
        } ${
          locale === 'zh'
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-800'
        }`}
        aria-pressed={locale === 'zh'}
      >
        中文
      </button>
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`rounded-full transition-colors ${
          compact ? 'px-2 py-1' : 'px-2.5 py-1.5 md:px-3'
        } ${
          locale === 'en'
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-800'
        }`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
};
