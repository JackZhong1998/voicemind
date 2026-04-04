import React, { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Network, FileText, Mic, ArrowRight } from 'lucide-react';
import { useClerk } from '@clerk/react';
import { BrandIcon } from './components/BrandIcon';
import { AccountMiniMenu } from './components/AccountMiniMenu';
import { HeroVoiceVisual } from './components/HeroVoiceVisual';
import { LocaleToggle } from './components/LocaleToggle';
import { useAppRoute } from './hooks/useAppRoute';
import { useLandingLocale } from './hooks/useLandingLocale';
import { LANDING_COPY } from './i18n/landingCopy';

export type LandingAuthMode = 'guest' | 'member';

interface LandingPageProps {
  authMode: LandingAuthMode;
  /** 已登录用户从首页进入产品 */
  onMemberEnterApp?: () => void;
}

const featureIcons = [Network, FileText, Mic] as const;

export const LandingPage: React.FC<LandingPageProps> = ({
  authMode,
  onMemberEnterApp,
}) => {
  const { locale, setLocale, t } = useLandingLocale();
  const { navigateTo } = useAppRoute();
  const clerk = useClerk();

  useEffect(() => {
    const copy = LANDING_COPY[locale];
    const mergedKeywords = `${copy.meta.keywords},${copy.ceo.tdk.keywords}`;
    document.title = copy.meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', copy.meta.description);
    let kwEl = document.querySelector('meta[name="keywords"]');
    if (!kwEl) {
      kwEl = document.createElement('meta');
      kwEl.setAttribute('name', 'keywords');
      document.head.appendChild(kwEl);
    }
    kwEl.setAttribute('content', mergedKeywords);
  }, [locale]);

  const ceoPersonLd = useMemo(() => {
    const copy = LANDING_COPY[locale];
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: copy.ceo.name,
      jobTitle: copy.ceo.role,
      description: copy.ceo.tdk.description,
      knowsAbout: copy.ceo.tdk.keywords
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean),
      worksFor: {
        '@type': 'Organization',
        name: 'VoiceMind AI',
        description: copy.meta.description,
      },
    };
  }, [locale]);

  const onPrimaryCta = () => {
    if (authMode === 'member') {
      onMemberEnterApp?.();
      return;
    }
    clerk.openSignIn({});
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100"
        aria-label={t.nav.aria}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[4.5rem] md:h-20 flex items-center justify-between gap-3">
          <a
            href="#top"
            className="flex items-center gap-2.5 min-w-0 shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            aria-label={t.nav.logoAria}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 shadow-lg shadow-zinc-900/15">
              <BrandIcon size={22} className="text-white" aria-hidden />
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight truncate">
              VoiceMind AI
            </span>
          </a>
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-zinc-500">
            <a href="#features" className="hover:text-zinc-900 transition-colors whitespace-nowrap">
              {t.nav.features}
            </a>
            <a href="#how-it-works" className="hover:text-zinc-900 transition-colors whitespace-nowrap">
              {t.nav.how}
            </a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors whitespace-nowrap">
              {t.nav.pricing}
            </a>
            <a
              href="/blog"
              className="hover:text-zinc-900 transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/blog');
              }}
            >
              {t.nav.blog}
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LocaleToggle locale={locale} onChange={setLocale} />
            <button
              type="button"
              onClick={onPrimaryCta}
              className="px-4 sm:px-5 py-2.5 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-all active:scale-95 whitespace-nowrap"
            >
              {authMode === 'member'
                ? locale === 'zh'
                  ? '进入应用'
                  : 'Open app'
                : t.nav.cta}
            </button>
            {authMode === 'member' ? <AccountMiniMenu placement="below" /> : null}
          </div>
        </div>
      </nav>

      <main id="top">
        <section
          className="pt-32 md:pt-36 pb-16 md:pb-20 px-6"
          aria-labelledby="hero-heading"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="inline-flex px-3.5 py-1.5 bg-zinc-100 text-zinc-600 rounded-full text-[11px] md:text-xs font-semibold tracking-wide mb-5">
                {t.hero.badge}
              </p>
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-3"
              >
                {t.hero.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-400 tracking-tight mb-4">
                {t.hero.subtitle}
              </p>
              <p className="max-w-xl mx-auto text-zinc-500 text-base md:text-lg leading-relaxed mb-8">
                {t.hero.desc}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                <button
                  type="button"
                  onClick={onPrimaryCta}
                  className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-full font-semibold text-base flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200/80 active:scale-[0.98]"
                >
                  <span>
                    {authMode === 'member'
                      ? locale === 'zh'
                        ? '进入应用'
                        : 'Open app'
                      : t.hero.ctaPrimary}
                  </span>
                  <ArrowRight size={18} className="shrink-0" aria-hidden />
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-full font-semibold text-base hover:bg-zinc-50 transition-all active:scale-[0.98]"
                >
                  {t.hero.ctaDemo}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55 }}
            >
              <HeroVoiceVisual
                key={locale}
                typingSegments={t.heroVisual.typingSegments}
                panelLabel={t.heroVisual.panelLabel}
                footerHint={t.heroVisual.footerHint}
              />
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-20 bg-zinc-50" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-6">
            <header className="max-w-3xl mb-12 md:mb-14">
              <h2 id="features-heading" className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-3">
                {t.features.heading}
              </h2>
              <p className="text-zinc-500 md:text-lg leading-relaxed">{t.features.intro}</p>
            </header>
            <div className="grid md:grid-cols-3 gap-10 md:gap-12">
              {t.features.cards.map((card, i) => {
                const Icon = featureIcons[i];
                return (
                  <article key={card.title} className="space-y-3">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-900">
                      <Icon size={24} aria-hidden />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight">{card.title}</h3>
                    <p className="text-zinc-500 text-sm md:text-[15px] leading-relaxed">{card.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 md:py-20 px-6 border-t border-zinc-100" aria-labelledby="how-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="how-heading" className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-10 md:mb-12 text-center">
              {t.how.heading}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
              {t.how.steps.map((step, i) => (
                <div key={step.title} className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-zinc-900">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-14 md:py-16 px-6 bg-zinc-50 border-t border-zinc-100" aria-labelledby="pricing-heading">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <h2 id="pricing-heading" className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
              {t.pricing.heading}
            </h2>
            <p className="text-zinc-500 leading-relaxed text-sm md:text-base">{t.pricing.body}</p>
            <button
              type="button"
              onClick={onPrimaryCta}
              className="px-8 py-3.5 bg-zinc-900 text-white rounded-full font-semibold text-sm hover:bg-zinc-800 transition-all active:scale-95"
            >
              {authMode === 'member'
                ? locale === 'zh'
                  ? '进入应用'
                  : 'Open app'
                : t.pricing.cta}
            </button>
          </div>
        </section>

        <section
          id="about-founder"
          className="py-16 md:py-20 px-6 bg-white border-t border-zinc-100"
          aria-labelledby="ceo-heading"
        >
          <div className="max-w-3xl mx-auto">
            <h2
              id="ceo-heading"
              className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-2"
            >
              {t.ceo.sectionTitle}
            </h2>
            <p className="text-sm font-medium text-zinc-500 mb-1">{t.ceo.role}</p>
            <p className="text-lg font-semibold text-zinc-900 mb-4">{t.ceo.name}</p>
            <p className="text-zinc-600 leading-relaxed text-sm md:text-base">{t.ceo.bio}</p>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(ceoPersonLd) }}
            />
          </div>
        </section>
      </main>

      <footer className="py-10 md:py-12 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-400 text-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shrink-0">
              <BrandIcon size={18} className="text-white" aria-hidden />
            </div>
            <span className="font-bold text-zinc-900">VoiceMind AI</span>
          </div>
          <p>{t.footer.rights}</p>
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-6">
            <a
              href="/privacy"
              className="hover:text-zinc-900 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/privacy');
              }}
            >
              {t.footer.privacy}
            </a>
            <a
              href="/terms"
              className="hover:text-zinc-900 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/terms');
              }}
            >
              {t.footer.terms}
            </a>
            <a
              href="/blog"
              className="hover:text-zinc-900 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/blog');
              }}
            >
              {t.footer.blog}
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-zinc-900 transition-colors"
            >
              {t.footer.twitter}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
