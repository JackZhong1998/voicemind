import React, { useEffect, useRef, useState } from 'react';
import { useClerk, useUser } from '@clerk/react';
import { LogOut } from 'lucide-react';
import { useLandingLocale } from '../hooks/useLandingLocale';

type Props = {
  /** 导航栏内：菜单在头像下方展开 */
  placement?: 'below' | 'above';
  className?: string;
};

export const AccountMiniMenu: React.FC<Props> = ({
  placement = 'below',
  className = '',
}) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { locale } = useLandingLocale();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!isLoaded || !user) return null;

  const email = user.primaryEmailAddress?.emailAddress ?? '';
  const avatar = user.imageUrl;
  const label = user.fullName || email || (locale === 'zh' ? '用户' : 'Account');

  const signOutLabel = locale === 'zh' ? '退出登录' : 'Sign out';

  return (
    <div className={`relative ${className}`} ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`rounded-full p-0.5 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:opacity-90 active:scale-[0.97] ${
          open ? 'ring-2 ring-zinc-200 ring-offset-2 ring-offset-white' : ''
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={locale === 'zh' ? '账户菜单' : 'Account menu'}
      >
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover shadow-md shadow-zinc-900/10"
          />
        ) : (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white shadow-md shadow-zinc-900/20">
            {label.slice(0, 1).toUpperCase()}
          </div>
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute right-0 z-[70] w-64 rounded-2xl border border-zinc-200 bg-white py-2 shadow-xl ${
            placement === 'below'
              ? 'top-[calc(100%+8px)]'
              : 'bottom-[calc(100%+8px)]'
          }`}
        >
          <div className="px-4 py-3 border-b border-zinc-100">
            <p className="text-sm font-semibold text-zinc-900 truncate">{label}</p>
            {email ? (
              <p className="text-xs text-zinc-500 truncate mt-1">{email}</p>
            ) : null}
            {user.username ? (
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                @{user.username}
              </p>
            ) : null}
          </div>
          <div className="pt-1">
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
            >
              <LogOut size={16} className="shrink-0" />
              {signOutLabel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
