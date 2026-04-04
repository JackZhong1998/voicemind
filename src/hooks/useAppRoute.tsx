import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/** 产品内页路径（与官网 `/` 区分） */
export const APP_ROUTE_PATH = '/app';

export function isAppPathname(pathname: string) {
  return pathname === APP_ROUTE_PATH || pathname.startsWith(`${APP_ROUTE_PATH}/`);
}

export type AppRouteContextValue = {
  pathname: string;
  isApp: boolean;
  goApp: () => void;
  goHome: () => void;
  replaceTo: (path: string) => void;
  navigateTo: (path: string) => void;
};

const AppRouteContext = createContext<AppRouteContextValue | null>(null);

export function AppRouteProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  const sync = useCallback(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    const onPop = () => sync();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [sync]);

  const goApp = useCallback(() => {
    window.history.pushState({}, '', APP_ROUTE_PATH);
    sync();
  }, [sync]);

  const goHome = useCallback(() => {
    window.history.pushState({}, '', '/');
    sync();
  }, [sync]);

  const replaceTo = useCallback(
    (path: string) => {
      window.history.replaceState({}, '', path);
      sync();
    },
    [sync]
  );

  const navigateTo = useCallback(
    (path: string) => {
      window.history.pushState({}, '', path);
      sync();
    },
    [sync]
  );

  const value = useMemo(
    () => ({
      pathname,
      isApp: isAppPathname(pathname),
      goApp,
      goHome,
      replaceTo,
      navigateTo,
    }),
    [pathname, goApp, goHome, replaceTo, navigateTo]
  );

  return <AppRouteContext.Provider value={value}>{children}</AppRouteContext.Provider>;
}

export function useAppRoute(): AppRouteContextValue {
  const ctx = useContext(AppRouteContext);
  if (!ctx) {
    throw new Error('useAppRoute must be used within AppRouteProvider');
  }
  return ctx;
}
