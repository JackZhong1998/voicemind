import React from 'react';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { usePageMeta } from '../hooks/usePageMeta';
import { PRIVACY_SECTIONS } from '../i18n/legalCopy';
import { LegalPageChrome } from './LegalPageChrome';

export const PrivacyPage: React.FC = () => {
  const { locale } = useLandingLocale();
  const title = locale === 'zh' ? '隐私政策 | VoiceMind AI' : 'Privacy Policy | VoiceMind AI';
  const desc =
    locale === 'zh'
      ? 'VoiceMind AI 如何收集、使用与保护您的数据；AI 处理、本地存储与第三方登录说明。'
      : 'How VoiceMind AI collects, uses, and protects your data—including AI processing and sign-in.';
  usePageMeta(title, desc);

  const sections = PRIVACY_SECTIONS[locale];
  const docTitle = locale === 'zh' ? '隐私政策' : 'Privacy Policy';

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
