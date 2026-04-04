/**
 * Vite 对无扩展名导入会优先解析到 `.ts`；实现含 JSX，放在 `.tsx` 中并由本文件转发导出，
 * 避免开发环境仍请求已不存在的 `useLandingLocale.ts` 导致 404。
 */
export { LandingLocaleProvider, useLandingLocale } from './useLandingLocale.tsx';
