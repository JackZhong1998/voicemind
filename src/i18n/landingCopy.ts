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
      title: 'VoiceMind AI — 语音生成思维导图与文档 · 语音任务双 Agent',
      description:
        '用语音把想法变成可编辑思维导图与正式文档；复杂长任务交给「语音任务」：对话 Agent 拆解待办，执行 Agent 逐项交付，点按即可查看结果。',
      keywords:
        'VoiceMind,语音思维导图,语音生成文档,语音任务,对话Agent,执行Agent,待办拆解,语音笔记,知识结构化,语音优先',
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
      badge: '口述即产出',
      title: '语音生成导图、文档与待办',
      subtitle: '创作模式 + 语音任务模式，一套工具搞定结构化输出',
      desc: '创作模式：把口述变成思维导图或可编辑文档。语音任务：用对话 Agent 听懂长任务、生成右侧待办列表，再由执行 Agent 逐项完成——点击即可展开交付内容。',
      ctaPrimary: '免费开始',
      ctaDemo: '观看演示',
    },
    heroVisual: {
      panelLabel: '实时语音转写',
      footerHint: '导图 · 文档 · 双 Agent 任务',
      typingSegments: [
        '一边想一边说…',
        ' ',
        '→ 思维导图',
        ' · ',
        '正式文档',
        ' · ',
        '待办与执行',
        ' …',
      ],
    },
    features: {
      heading: '核心功能',
      intro: '三种能力共用同一套语音工作流：少打字、快结构化、长任务也能拆得清。',
      cards: [
        {
          title: '语音生成思维导图',
          body: '口述主题与分支，AI 整理成层次清晰的导图，适合头脑风暴、复习提纲与会议纪要的结构化呈现。',
        },
        {
          title: '语音生成文档',
          body: '将口述整理为带标题与要点的正式 Markdown 文档，纪要、方案与长文可先说出来再微调。',
        },
        {
          title: '语音任务 · 双 Agent',
          body: '对话 Agent 与你多轮沟通并持续更新待办；执行 Agent 针对每一条单独调用。待办固定在对话右侧，点按展开对应结果。',
        },
      ],
    },
    how: {
      heading: '使用方式',
      steps: [
        {
          title: '登录并进入应用',
          body: '顶部可在「文档与导图」与「语音任务」两种工作区之间切换。',
        },
        {
          title: '创作：导图或文档',
          body: '录音或口述后生成——右侧在思维导图与文档视图间切换，可导出大纲或继续编辑正文。',
        },
        {
          title: '语音任务：说清目标',
          body: '在中间对话区用语音下达长任务；右侧待办由对话 Agent 维护，点开某项即触发执行 Agent 产出详细结果。',
        },
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
        '常驻中国香港，从事互联网产品工作。长期关注「语音优先」与知识结构化，希望减少键盘打断心流的时间，把口述更快变成导图、文档，以及可执行的待办与交付。VoiceMind AI 由个人运营维护，结合大模型整理与双 Agent 协作，面向需要快速产出纪要、大纲与复杂任务拆解的用户。联系：carneyzz@foxmail.com。',
      tdk: {
        title: 'Jack Zhong | VoiceMind AI 创建者 · 香港 · 语音导图 · 语音文档 · 双 Agent',
        description:
          'Jack Zhong：互联网公司产品经理，于中国香港个人运营 VoiceMind AI，专注语音生成思维导图与文档、语音任务双 Agent 与效率工具方向。',
        keywords:
          'Jack Zhong,VoiceMind AI,香港,产品经理,语音思维导图,语音文档,AI Agent,个人开发者,语音优先',
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
      lastUpdatedOn: '2026年4月16日',
    },
  },
  en: {
    meta: {
      title: 'VoiceMind AI — Voice Mind Maps, Documents & Dual-Agent Tasks',
      description:
        'Speak to generate editable mind maps and polished documents. Voice Tasks mode adds a chat agent that maintains a todo list on the right—tap any item to run a worker agent and expand the deliverable.',
      keywords:
        'VoiceMind,voice mind map,voice to document,voice tasks,AI agents,todo breakdown,voice notes,productivity,voice-first',
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
      badge: 'Speak to ship',
      title: 'Voice → mind maps, docs & agent todos',
      subtitle: 'Create mode plus Voice Tasks—one workflow, three outputs',
      desc: 'Create mode turns speech into an editable mind map or Markdown document. Voice Tasks adds a chat agent that keeps todos on the right; a worker agent runs per item—tap to expand the full deliverable.',
      ctaPrimary: 'Start free',
      ctaDemo: 'Watch demo',
    },
    heroVisual: {
      panelLabel: 'Live voice typing',
      footerHint: 'Maps · docs · dual-agent tasks',
      typingSegments: [
        'Think out loud…',
        ' ',
        '→ mind map',
        ' · ',
        'document',
        ' · ',
        'todos & execution',
        ' …',
      ],
    },
    features: {
      heading: 'Key features',
      intro: 'One voice-first flow for structure, prose, and long tasks you can actually break down.',
      cards: [
        {
          title: 'Voice-generated mind maps',
          body: 'Describe themes and branches—AI shapes a clear hierarchy for brainstorms, study notes, and meeting takeaways.',
        },
        {
          title: 'Voice-generated documents',
          body: 'Turn narration into structured Markdown with headings and bullets—draft memos and specs by talking, then edit lightly.',
        },
        {
          title: 'Voice tasks · dual agents',
          body: 'The chat agent converses and refreshes the todo list beside your thread. The worker agent runs once per todo; expand any row to read the detailed output.',
        },
      ],
    },
    how: {
      heading: 'How it works',
      steps: [
        {
          title: 'Open the app',
          body: 'Use the top bar to switch between Doc & mind map mode and Voice Tasks.',
        },
        {
          title: 'Create: map or document',
          body: 'Record or dictate, then generate—toggle the preview between mind map and document, export outlines, or edit the text.',
        },
        {
          title: 'Voice Tasks: describe the goal',
          body: 'Talk through a big task in the chat column; todos stay on the right. Open an item to trigger the worker agent and view its Markdown result.',
        },
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
        'Based in Hong Kong SAR. I work in internet product and care about voice-first capture and knowledge structuring—turning speech into mind maps, documents, and actionable todos with agent-assisted execution. VoiceMind AI is a personally operated project. Contact: carneyzz@foxmail.com.',
      tdk: {
        title: 'Jack Zhong | VoiceMind AI · Hong Kong · Voice Maps, Docs & Dual Agents',
        description:
          'Jack Zhong: product manager operating VoiceMind AI from Hong Kong—voice mind maps, voice documents, and dual-agent voice tasks.',
        keywords:
          'Jack Zhong,VoiceMind AI,Hong Kong,product manager,voice mind map,voice document,AI agents,indie maker,voice-first',
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
      lastUpdatedOn: 'April 16, 2026',
    },
  },
};
