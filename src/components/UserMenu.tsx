import React, { useEffect, useRef, useState } from 'react';
import { useClerk, useUser } from '@clerk/react';
import { Home, LogOut, FileText, Shield } from 'lucide-react';
import { LocaleToggle } from './LocaleToggle';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { LANDING_COPY, type LandingLocale } from '../i18n/landingCopy';

type Props = {
  onGoHome: () => void;
};

const LEGAL: Record<
  LandingLocale,
  { privacyTitle: string; privacyBody: string; termsTitle: string; termsBody: string }
> = {
  zh: {
    privacyTitle: '隐私政策',
    privacyBody:
      '我们会依照适用法律法规处理您的账户与使用数据。语音与导图内容默认仅保存在本机浏览器中；使用 AI 服务时，相关文本会发送至模型提供方处理。完整政策以正式版本为准。',
    termsTitle: '用户协议',
    termsBody:
      '使用 VoiceMind AI 即表示您同意遵守服务条款。请合理使用服务，勿用于违法或侵权用途。完整协议以正式版本为准。',
  },
  en: {
    privacyTitle: 'Privacy',
    privacyBody:
      'We process your account and usage data in line with applicable laws. Voice and mind-map content is stored locally in your browser by default; when using AI features, text may be sent to the model provider. See the full policy when published.',
    termsTitle: 'Terms of use',
    termsBody:
      'By using VoiceMind AI you agree to the terms of service. Use the product lawfully. Full terms apply when published.',
  },
};

export const UserMenu: React.FC<Props> = ({ onGoHome }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { locale, setLocale } = useLandingLocale();
  const t = LANDING_COPY[locale];
  const legal = LEGAL[locale];
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState<null | 'privacy' | 'terms'>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const avatar = user?.imageUrl;
  const label = user?.fullName || email || 'Account';

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[60]" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`rounded-full p-0.5 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 hover:opacity-90 active:scale-[0.97] ${
            open ? 'ring-2 ring-zinc-200 ring-offset-2 ring-offset-zinc-50' : ''
          }`}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={locale === 'zh' ? '账户菜单' : 'Account menu'}
        >
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="h-9 w-9 rounded-full object-cover shadow-md shadow-zinc-900/15"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white shadow-md shadow-zinc-900/20">
              {label.slice(0, 1).toUpperCase()}
            </div>
          )}
        </button>

        {open ? (
          <div
            role="menu"
            className="absolute bottom-[calc(100%+8px)] right-0 w-[200px] rounded-xl border border-zinc-200 bg-white py-1.5 shadow-xl shadow-zinc-900/10"
          >
            <div className="px-3 pb-2 border-b border-zinc-100">
              <p className="text-[13px] font-semibold text-zinc-900 truncate leading-tight">{label}</p>
              {email ? (
                <p className="text-[11px] text-zinc-500 truncate mt-1 leading-snug">{email}</p>
              ) : null}
            </div>
            <div className="py-0.5">
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-zinc-700 hover:bg-zinc-50"
                onClick={() => {
                  setOpen(false);
                  onGoHome();
                }}
              >
                <Home size={15} className="text-zinc-400 shrink-0" />
                {locale === 'zh' ? '返回首页' : 'Home'}
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-zinc-700 hover:bg-zinc-50"
                onClick={() => {
                  setOpen(false);
                  setSheet('privacy');
                }}
              >
                <Shield size={15} className="text-zinc-400 shrink-0" />
                {t.footer.privacy}
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-zinc-700 hover:bg-zinc-50"
                onClick={() => {
                  setOpen(false);
                  setSheet('terms');
                }}
              >
                <FileText size={15} className="text-zinc-400 shrink-0" />
                {t.footer.terms}
              </button>
            </div>
            <div className="px-3 py-2 border-t border-zinc-100">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                {locale === 'zh' ? '界面语言' : 'Language'}
              </p>
              <div className="w-fit max-w-full">
                <LocaleToggle variant="compact" locale={locale} onChange={setLocale} />
              </div>
            </div>
            <div className="border-t border-zinc-100 pt-0.5">
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50"
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
              >
                <LogOut size={15} className="shrink-0" />
                {locale === 'zh' ? '退出登录' : 'Sign out'}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {sheet ? (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSheet(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-zinc-900 mb-3">
              {sheet === 'privacy' ? legal.privacyTitle : legal.termsTitle}
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
              {sheet === 'privacy' ? legal.privacyBody : legal.termsBody}
            </p>
            <button
              type="button"
              className="mt-6 w-full py-3 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800"
              onClick={() => setSheet(null)}
            >
              {locale === 'zh' ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};
