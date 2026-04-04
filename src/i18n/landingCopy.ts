export type LandingLocale = 'zh' | 'en';

export const LANDING_LOCALE_STORAGE_KEY = 'voicemind_landing_locale';

export function readStoredLandingLocale(): LandingLocale {
  try {
    const v = localStorage.getItem(LANDING_LOCALE_STORAGE_KEY);
    return v === 'zh' ? 'zh' : 'en';
  } catch {
    return 'en';
  }
}

export type LandingCopy = {
  meta: { title: string; description: string; keywords: string };
  nav: {
    aria: string;
    logoAria: string;
    features: string;
    how: string;
    pricing: string;
    blog: string;
    cta: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    desc: string;
    ctaPrimary: string;
    ctaDemo: string;
  };
  heroVisual: {
    panelLabel: string;
    footerHint: string;
    typingSegments: readonly string[];
  };
  features: { heading: string; intro: string; cards: { title: string; body: string }[] };
  how: { heading: string; steps: { title: string; body: string }[] };
  pricing: { heading: string; body: string; cta: string };
  ceo: {
    sectionTitle: string;
    name: string;
    role: string;
    bio: string;
    /** 专用于创始人/团队介绍的 SEO（可与首页 meta 组合使用） */
    tdk: { title: string; description: string; keywords: string };
  };
  footer: { rights: string; privacy: string; terms: string; blog: string; twitter: string };
  legalLayout: {
    backHome: string;
    lastUpdatedLabel: string;
    lastUpdatedOn: string;
  };
};

export const LANDING_COPY: Record<LandingLocale, LandingCopy> = {
  zh: {
    meta: {
      title: 'VoiceMind AI — 语音转思维导图、语音写文档',
      description:
        'VoiceMind AI：语音转思维导图、语音写文档，把想法结构化呈现，全程免打字。',
      keywords:
        'VoiceMind,语音转思维导图,语音写文档,语音笔记,口述文档,思维导图,效率工具,AI笔记,语音优先,创始人,产品负责人',
    },
    nav: {
      aria: '主导航',
      logoAria: 'VoiceMind AI 首页',
      features: '功能',
      how: '使用方式',
      pricing: '定价',
      blog: '博客',
      cta: '免费开始',
    },
    hero: {
      badge: '用声音记录想法',
      title: '说出来，看得见',
      subtitle: '语音转思维导图、语音写文档，全程免打字',
      desc: '口述即可生成可编辑思维导图，也可整理成连贯正文——专注表达，少碰键盘。',
      ctaPrimary: '免费开始',
      ctaDemo: '观看演示',
    },
    heroVisual: {
      panelLabel: '实时语音转写',
      footerHint: '语音 → 结构 → 正文',
      typingSegments: [
        '用声音理清思路…',
        ' ',
        '→ 语音转思维导图',
        ' · ',
        '语音写文档',
        ' …',
      ],
    },
    features: {
      heading: '核心功能',
      intro: '从「想到」到「写出来」，语音贯穿全流程。',
      cards: [
        {
          title: '语音转思维导图',
          body: '口述分支与层次，实时得到可编辑导图；头脑风暴、复习、会议一图读懂结构。',
        },
        {
          title: '语音写文档',
          body: '从大纲到正文全程口述，纪要、方案、长文不必停下手打字。',
        },
        {
          title: '用声音记录想法',
          body: '以录音与口述为起点，先留住第一反应，再整理成导图或文档。',
        },
      ],
    },
    how: {
      heading: '使用方式',
      steps: [
        { title: '说话或录音', body: '像平时一样口述，无需先排版。' },
        { title: '生成导图或文档', body: '语音转写并结构化：导图或连贯正文。' },
        { title: '编辑与沉淀', body: '微调结果并保存，便于日后复用。' },
      ],
    },
    pricing: {
      heading: '定价',
      body: '当前可免费使用；若推出付费方案，将在此更新说明。',
      cta: '免费开始',
    },
    ceo: {
      sectionTitle: '关于创始人',
      name: 'Jack Zhong',
      role: 'VoiceMind AI 创建者 · 互联网公司产品经理',
      bio:
        '常驻中国香港，从事互联网产品工作。长期关注「语音优先」与知识结构化，希望减少键盘打断心流的时间，把口述与灵感更快变成可编辑的思维导图与文档。VoiceMind AI 由个人运营维护，结合大模型整理与结构化能力，面向需要快速产出纪要、大纲与笔记的用户。联系：carneyzz@foxmail.com。',
      tdk: {
        title: 'Jack Zhong | VoiceMind AI 创建者 · 香港 · 语音转思维导图',
        description:
          'Jack Zhong：互联网公司产品经理，于中国香港个人运营 VoiceMind AI，专注语音转思维导图、语音写文档与效率工具方向。',
        keywords:
          'Jack Zhong,VoiceMind AI,香港,产品经理,语音思维导图,语音文档,个人开发者,语音优先',
      },
    },
    footer: {
      rights: '© 2026 VoiceMind AI · 由 Jack Zhong（中国香港）运营。',
      privacy: '隐私政策',
      terms: '用户协议',
      blog: '博客',
      twitter: 'Twitter',
    },
    legalLayout: {
      backHome: '← 返回首页',
      lastUpdatedLabel: '最近更新',
      lastUpdatedOn: '2026年4月4日',
    },
  },
  en: {
    meta: {
      title: 'VoiceMind AI — Voice Mind Maps & Documents',
      description:
        'VoiceMind AI turns speech into editable mind maps and long-form documents—capture ideas hands-free, structured by AI.',
      keywords:
        'VoiceMind,voice mind map,voice to document,voice notes,AI productivity,speech to outline,mind map app,voice-first,founder',
    },
    nav: {
      aria: 'Main navigation',
      logoAria: 'VoiceMind AI home',
      features: 'Features',
      how: 'How it works',
      pricing: 'Pricing',
      blog: 'Blog',
      cta: 'Start free',
    },
    hero: {
      badge: 'Voice-first capture',
      title: 'Speak it. See it.',
      subtitle: 'Mind maps & docs—no typing',
      desc: 'Talk through your ideas and get an editable mind map or clean prose—stay in flow, off the keyboard.',
      ctaPrimary: 'Start free',
      ctaDemo: 'Watch demo',
    },
    heroVisual: {
      panelLabel: 'Live voice typing',
      footerHint: 'Voice → structure → text',
      typingSegments: [
        'Capture thoughts by voice…',
        ' ',
        '→ mind map',
        ' · ',
        'outlines & documents',
        ' …',
      ],
    },
    features: {
      heading: 'Key features',
      intro: 'From spark to structured output—voice all the way.',
      cards: [
        {
          title: 'Voice to mind map',
          body: 'Speak branches and hierarchy—get an editable map for brainstorms, study sessions, and meetings.',
        },
        {
          title: 'Hands-free documents',
          body: 'Go from outline to paragraphs by voice—memos, specs, and longform without typing.',
        },
        {
          title: 'Ideas on record',
          body: 'Start with recording or dictation, then let AI shape it into maps or prose.',
        },
      ],
    },
    how: {
      heading: 'How it works',
      steps: [
        { title: 'Speak or record', body: 'Talk naturally—no formatting prep.' },
        { title: 'Generate map or doc', body: 'Transcript → structured map or flowing text.' },
        { title: 'Refine & save', body: 'Tweak results and keep them for reuse.' },
      ],
    },
    pricing: {
      heading: 'Pricing',
      body: 'Free to use today. Paid tiers, if any, will be announced here.',
      cta: 'Start free',
    },
    ceo: {
      sectionTitle: 'About the founder',
      name: 'Jack Zhong',
      role: 'Creator, VoiceMind AI · Product manager (internet industry)',
      bio:
        'Based in Hong Kong SAR. I work in internet product and care about voice-first capture and knowledge structuring—turning spoken ideas into editable mind maps and documents with less typing. VoiceMind AI is a personally operated project. Contact: carneyzz@foxmail.com.',
      tdk: {
        title: 'Jack Zhong | VoiceMind AI Creator · Hong Kong · Voice to Mind Maps',
        description:
          'Jack Zhong: product manager in the internet industry, operating VoiceMind AI from Hong Kong—voice to mind maps, voice documents, and productivity.',
        keywords:
          'Jack Zhong,VoiceMind AI,Hong Kong,product manager,voice mind map,voice documents,indie maker,voice-first',
      },
    },
    footer: {
      rights: '© 2026 VoiceMind AI · Operated by Jack Zhong (Hong Kong).',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      blog: 'Blog',
      twitter: 'Twitter',
    },
    legalLayout: {
      backHome: '← Back to home',
      lastUpdatedLabel: 'Last updated',
      lastUpdatedOn: 'April 4, 2026',
    },
  },
};
