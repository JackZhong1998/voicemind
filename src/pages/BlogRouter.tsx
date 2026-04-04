import React from 'react';
import { BrandIcon } from '../components/BrandIcon';
import { LocaleToggle } from '../components/LocaleToggle';
import { useAppRoute } from '../hooks/useAppRoute';
import { useLandingLocale } from '../hooks/useLandingLocale';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  BLOG_POSTS,
  blogPath,
  getBlogPostBySlug,
  type BlogPost,
} from '../i18n/blogPosts';

function BlogChrome({ children }: { children: React.ReactNode }) {
  const { goHome, navigateTo } = useAppRoute();
  const { locale, setLocale, t } = useLandingLocale();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">{children}</div>
      <footer className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 text-sm text-zinc-500 flex flex-wrap gap-4">
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
      </footer>
    </div>
  );
}

function BlogIndex() {
  const { locale, t } = useLandingLocale();
  const { navigateTo } = useAppRoute();
  const title =
    locale === 'zh' ? '博客与最佳实践 | VoiceMind AI' : 'Blog & best practices | VoiceMind AI';
  const desc =
    locale === 'zh'
      ? '语音转思维导图、口述文档与效率习惯的短文，便于搜索与复用。'
      : 'Short guides on voice mind maps, spoken documents, and productivity habits.';
  usePageMeta(title, desc);

  const sorted = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <BlogChrome>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-2">
        {t.nav.blog}
      </h1>
      <p className="text-zinc-500 mb-10 max-w-xl">{desc}</p>
      <ul className="space-y-4">
        {sorted.map((post) => (
          <li key={post.slug}>
            <button
              type="button"
              onClick={() => navigateTo(blogPath(post.slug))}
              className="w-full text-left rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-900/5 hover:border-zinc-300 transition-colors"
            >
              <time
                dateTime={post.date}
                className="text-xs font-mono text-zinc-400"
              >
                {post.date}
              </time>
              <h2 className="text-lg font-semibold text-zinc-900 mt-1">
                {post.title[locale]}
              </h2>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                {post.description[locale]}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </BlogChrome>
  );
}

function BlogArticle({ post }: { post: BlogPost }) {
  const { locale, t } = useLandingLocale();
  const { navigateTo } = useAppRoute();
  const title = `${post.title[locale]} | VoiceMind AI`;
  usePageMeta(title, post.description[locale]);
  const backLabel = `← ${t.nav.blog}`;

  return (
    <BlogChrome>
      <button
        type="button"
        onClick={() => navigateTo(blogPath())}
        className="text-sm text-zinc-500 hover:text-zinc-900 mb-6"
      >
        {backLabel}
      </button>
      <article>
        <time dateTime={post.date} className="text-xs font-mono text-zinc-400">
          {post.date}
        </time>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mt-2 mb-6">
          {post.title[locale]}
        </h1>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8">
          <div className="text-zinc-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {post.body[locale]}
          </div>
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title[locale],
            description: post.description[locale],
            datePublished: post.date,
            author: { '@type': 'Organization', name: 'VoiceMind AI' },
            publisher: { '@type': 'Organization', name: 'VoiceMind AI' },
          }),
        }}
      />
    </BlogChrome>
  );
}

function BlogNotFound() {
  const { locale, t } = useLandingLocale();
  const { navigateTo } = useAppRoute();
  usePageMeta(
    locale === 'zh' ? '未找到文章 | VoiceMind AI' : 'Post not found | VoiceMind AI'
  );

  return (
    <BlogChrome>
      <p className="text-zinc-600 mb-4">
        {locale === 'zh' ? '这篇文章不存在或已移动。' : 'This post does not exist or has moved.'}
      </p>
      <button
        type="button"
        onClick={() => navigateTo(blogPath())}
        className="text-sm font-medium text-zinc-900 underline"
      >
        {t.nav.blog}
      </button>
    </BlogChrome>
  );
}

export const BlogRouter: React.FC = () => {
  const { pathname } = useAppRoute();
  const raw = pathname.replace(/^\/blog\/?/, '').replace(/\/$/, '');
  if (!raw) {
    return <BlogIndex />;
  }
  const post = getBlogPostBySlug(raw);
  if (!post) {
    return <BlogNotFound />;
  }
  return <BlogArticle post={post} />;
};
