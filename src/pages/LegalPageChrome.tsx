import React, { type ReactNode } from 'react';
import { BrandIcon } from '../components/BrandIcon';
import { LocaleToggle } from '../components/LocaleToggle';
import { useAppRoute } from '../hooks/useAppRoute';
import { useLandingLocale } from '../hooks/useLandingLocale';

export function LegalPageChrome({
  docTitle,
  children,
}: {
  docTitle: string;
  children: ReactNode;
}) {
  const { goHome, navigateTo } = useAppRoute();
  const { locale, setLocale, t } = useLandingLocale();

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goHome}
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            {t.legalLayout.backHome}
          </button>
          <div className="flex items-center gap-2">
            <LocaleToggle locale={locale} onChange={setLocale} />
            <button
              type="button"
              onClick={goHome}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white"
              aria-label={t.nav.logoAria}
            >
              <BrandIcon size={18} className="text-white" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <p className="text-xs text-zinc-400 mb-2">
          {t.legalLayout.lastUpdatedLabel}：{t.legalLayout.lastUpdatedOn}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-8">
          {docTitle}
        </h1>
        <article className="prose prose-zinc prose-sm md:prose-base max-w-none space-y-8">
          {children}
        </article>

        <nav className="mt-12 pt-8 border-t border-zinc-100 flex flex-wrap gap-4 text-sm text-zinc-500">
          <a
            href="/privacy"
            className="hover:text-zinc-900"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/privacy');
            }}
          >
            {t.footer.privacy}
          </a>
          <a
            href="/terms"
            className="hover:text-zinc-900"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/terms');
            }}
          >
            {t.footer.terms}
          </a>
          <a
            href="/blog"
            className="hover:text-zinc-900"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/blog');
            }}
          >
            {t.footer.blog}
          </a>
        </nav>
      </main>
    </div>
  );
}
