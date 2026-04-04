import type { LandingLocale } from './landingCopy';

export type BlogPost = {
  slug: string;
  title: Record<LandingLocale, string>;
  description: Record<LandingLocale, string>;
  /** ISO date for SEO */
  date: string;
  /** 正文：多段 plain text，组件里用 whitespace-pre-wrap */
  body: Record<LandingLocale, string>;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'voice-to-mind-map-best-practices',
    title: {
      zh: '语音转思维导图：5 条让结构更清晰的最佳实践',
      en: 'Voice to mind map: 5 practices for clearer structure',
    },
    description: {
      zh: '从口述习惯、分支命名到会议场景，帮你用语音更快得到可用的思维导图。',
      en: 'Dictation habits, branch naming, and meeting workflows for better voice mind maps.',
    },
    date: '2026-04-02',
    body: {
      zh: `1. 先讲「主题」，再展开分支
开口先用一两句话交代中心议题，再按「第一、第二」或「接下来」自然分段，模型更容易把根节点和一级分支对齐你的思路。

2. 控制每层的信息量
每一层口述控制在几秒到十几秒，避免单节点塞入整段故事；需要细节时再说「关于刚才那一点，补充三点」。

3. 用连接词表达层次
「下面分三块」「反过来」「总结一下」这类信号对结构化特别友好，相当于给导图自动生成大纲记号。

4. 会议场景：先结论后过程
若用于会议纪要，可以先口述结论与待办，再补充背景；导图会更像可执行的纪要而不是流水账。

5. 善用补充粘贴区
背景材料、术语表、客户名单等可贴在侧栏补充区，与口述合并作为上下文，减少口头重复念资料的时间。`,
      en: `1. State the theme first
Open with the main topic in one or two sentences, then branch with “first / second / next” cues so the root and primary branches align with your intent.

2. Keep each layer bite-sized
Speak a few seconds per idea; add detail with “three points about the last item” instead of one giant node.

3. Use hierarchy signals
Phrases like “three parts below”, “on the other hand”, “to summarize” act like outline markers for structuring.

4. Meetings: decisions before narrative
For meeting maps, dictate decisions and actions first, then context—maps read more like actionable notes.

5. Use the paste context field
Drop glossaries, names, or references in the supplementary box so the model can merge them with speech without you repeating everything aloud.`,
    },
  },
  {
    slug: 'speech-to-document-outline',
    title: {
      zh: '从语音到正式文档：口述大纲怎么写更省力',
      en: 'From speech to documents: effortless spoken outlines',
    },
    description: {
      zh: '用口述完成一级二级标题与要点，再交给 AI 整理成 Markdown 文档的技巧。',
      en: 'Speak headings and bullets first, then let AI turn them into clean Markdown.',
    },
    date: '2026-04-03',
    body: {
      zh: `口述文档时，可以模仿「口头写目录」：先说「第一章讲背景，第二章讲方案」，每章下再用「要点有三个」列举。

避免在口述中夹杂过多修饰语，先骨架后细节；细节可以第二轮录音补充，或在文档面板里手改。

若文档需引用固定表述（法规条文、产品全称），建议粘贴到补充材料区，口述时用「见补充区第二条」指代，可减少口误。

生成后务必通读一层级标题是否覆盖你的真实意图——AI 不会替你承担事实核验责任。`,
      en: `Dictate like a verbal table of contents: “Chapter one is context, chapter two is proposal,” then “three bullet points under chapter two.”

Prefer structure first, polish second; you can record a second pass or edit in the document panel.

Paste fixed wording (legal names, specs) into the supplementary context and refer to it by pointer to reduce mis-speech.

Always skim headings after generation—you remain responsible for factual accuracy.`,
    },
  },
  {
    slug: 'voice-note-taking-seo-habits',
    title: {
      zh: '语音笔记与知识管理：适合「以后能搜到」的命名习惯',
      en: 'Voice notes you can find later: naming and SEO-friendly habits',
    },
    description: {
      zh: '让口述标题、关键词更利于回顾与搜索，对个人知识库和小团队分享都更友好。',
      en: 'Titling and keyword habits that make voice notes easier to revisit and search.',
    },
    date: '2026-04-04',
    body: {
      zh: `在口述开头加入「项目名 + 日期 + 主题」格式的口头标题，例如「Alpha 项目 4 月复盘 风险清单」，日后在本地历史或导出文件中都更易检索。

对反复出现的概念，尽量口播全称一次再缩略，例如「客户数据平台 CDP」，方便转写与搜索对齐。

导出 Markdown 或大纲时，可用统一前缀命名文件（如 VM-20260404-纪要.md），与浏览器下载目录中的其他资料区分。

若内容要发布到博客或文档站，口述时可直接说出目标关键词的自然语句，但避免堆砌；读者体验优先于搜索引擎。`,
      en: `Start with a spoken title like “Project Alpha — April review — risks” so history entries and exports stay searchable.

Say the full term once before acronyms (“customer data platform, CDP”) to align transcripts and search.

Use consistent file prefixes when exporting (e.g., VM-20260404-notes.md).

For public posts, weave keywords naturally—readers first, SEO second.`,
    },
  },
  {
    slug: 'browser-voice-vs-typing',
    title: {
      zh: '什么时候该用语音输入，什么时候仍应用键盘？',
      en: 'When to dictate vs. when to keep typing',
    },
    description: {
      zh: '结合心流、环境与隐私，快速判断语音与打字的边界。',
      en: 'Flow, environment, and privacy—choosing dictation vs. keyboard.',
    },
    date: '2026-04-01',
    body: {
      zh: `语音适合：头脑风暴、长段落初稿、行走或站立时记录、思路快于手指时。

键盘适合：精确编号、代码与符号、公开安静场合、涉及敏感内容需低声或文字更稳妥时。

混合工作流往往最高效：语音拉出结构与要点，键盘做精修与格式。

VoiceMind AI 的设计正是让「语音阶段」尽可能轻，把结构化交给模型，把最终润色留给你。`,
      en: `Dictation shines for brainstorming, long first drafts, walking/standing capture, and when ideas outpace typing.

Typing wins for symbols and code, quiet shared spaces, or when written form is safer for sensitivity.

Hybrid flows work best: voice for structure, keyboard for precision.

VoiceMind AI keeps the voice phase light, delegates structuring to the model, and leaves polish to you.`,
    },
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function blogPath(slug?: string): string {
  return slug ? `/blog/${slug}` : '/blog';
}
