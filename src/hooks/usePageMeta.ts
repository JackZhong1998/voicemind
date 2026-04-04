import { useEffect } from 'react';

/** 子页面 SEO：离开首页后由 useLandingLocale 在回到首页时覆盖 title/description */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (!description) return;
    const el = document.querySelector('meta[name="description"]');
    if (el) el.setAttribute('content', description);
  }, [title, description]);
}
