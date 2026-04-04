import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  LANDING_COPY,
  LANDING_LOCALE_STORAGE_KEY,
  type LandingCopy,
  type LandingLocale,
  readStoredLandingLocale,
} from '../i18n/landingCopy';

type LandingLocaleContextValue = {
  locale: LandingLocale;
  setLocale: (next: LandingLocale) => void;
  t: LandingCopy;
};

const LandingLocaleContext = createContext<LandingLocaleContextValue | null>(null);

export function LandingLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LandingLocale>(() => {
    if (typeof window === 'undefined') return 'en';
    return readStoredLandingLocale();
  });

  const setLocale = useCallback((next: LandingLocale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LANDING_LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    const isLandingHome = path === '/' || path === '';
    if (!isLandingHome) return;

    const copy = LANDING_COPY[locale];
    const { title, description, keywords } = copy.meta;
    const mergedKeywords = `${keywords},${copy.ceo.tdk.keywords}`;
    document.title = title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', description);
    let kwEl = document.querySelector('meta[name="keywords"]');
    if (!kwEl) {
      kwEl = document.createElement('meta');
      kwEl.setAttribute('name', 'keywords');
      document.head.appendChild(kwEl);
    }
    kwEl.setAttribute('content', mergedKeywords);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: LANDING_COPY[locale],
    }),
    [locale, setLocale]
  );

  return (
    <LandingLocaleContext.Provider value={value}>{children}</LandingLocaleContext.Provider>
  );
}

export function useLandingLocale(): LandingLocaleContextValue {
  const ctx = useContext(LandingLocaleContext);
  if (!ctx) {
    throw new Error('useLandingLocale must be used within LandingLocaleProvider');
  }
  return ctx;
}
