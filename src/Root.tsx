import React, { useEffect } from 'react';
import { ClerkLoaded, ClerkLoading, Show } from '@clerk/react';
import { LandingLocaleProvider } from './hooks/useLandingLocale';
import { AppRouteProvider, isAppPathname, useAppRoute } from './hooks/useAppRoute';
import { LandingPage } from './LandingPage';
import App from './App';
import { BlogRouter } from './pages/BlogRouter';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

/** 未登录访问 `/app` 时回到官网根路径 */
function GuestAppPathRedirect() {
  const { pathname, replaceTo } = useAppRoute();
  useEffect(() => {
    if (isAppPathname(pathname)) replaceTo('/');
  }, [pathname, replaceTo]);
  return null;
}

function SignedOutMarketingRoutes() {
  const { pathname } = useAppRoute();
  if (pathname === '/privacy') return <PrivacyPage />;
  if (pathname === '/terms') return <TermsPage />;
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return <BlogRouter />;
  return <LandingPage authMode="guest" />;
}

function SignedInShell() {
  const { isApp, goApp, goHome, pathname } = useAppRoute();
  if (isApp) {
    return <App onHome={goHome} />;
  }
  if (pathname === '/privacy') return <PrivacyPage />;
  if (pathname === '/terms') return <TermsPage />;
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return <BlogRouter />;
  return <LandingPage authMode="member" onMemberEnterApp={goApp} />;
}

/**
 * 官网：`/` · 产品内页：`/app`（History API + 单一 AppRouteProvider 同步路径）
 */
export const Root: React.FC = () => {
  return (
    <>
      <ClerkLoading>
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-500 text-sm">
          Loading…
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <LandingLocaleProvider>
          <AppRouteProvider>
            <Show when="signed-out">
              <GuestAppPathRedirect />
              <SignedOutMarketingRoutes />
            </Show>
            <Show when="signed-in">
              <SignedInShell />
            </Show>
          </AppRouteProvider>
        </LandingLocaleProvider>
      </ClerkLoaded>
    </>
  );
};
