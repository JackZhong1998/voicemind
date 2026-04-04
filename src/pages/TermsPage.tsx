import React from 'react';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { usePageMeta } from '../hooks/usePageMeta';
import { TERMS_SECTIONS } from '../i18n/legalCopy';
import { LegalPageChrome } from './LegalPageChrome';

export const TermsPage: React.FC = () => {
  const { locale } = useLandingLocale();
  const title =
    locale === 'zh' ? '用户协议 | VoiceMind AI' : 'Terms of Service | VoiceMind AI';
  const desc =
    locale === 'zh'
      ? 'VoiceMind AI 服务条款：使用规则、用户内容许可、免责声明与责任限制。'
      : 'VoiceMind AI terms of use, content license, disclaimers, and liability cap.';
  usePageMeta(title, desc);

  const sections = TERMS_SECTIONS[locale];
  const docTitle = locale === 'zh' ? '用户协议' : 'Terms of Service';

  return (
    <LegalPageChrome docTitle={docTitle}>
      {sections.map((s) => (
        <section key={s.heading ?? 'intro'} className="space-y-3">
          {s.heading ? (
            <h2 className="text-lg font-semibold text-zinc-900">{s.heading}</h2>
          ) : null}
          {s.paragraphs.map((p, i) => (
            <p key={i} className="text-zinc-600 leading-relaxed">
              {p}
            </p>
          ))}
        </section>
      ))}
    </LegalPageChrome>
  );
};
