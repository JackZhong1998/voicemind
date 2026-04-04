import type { LandingLocale } from './landingCopy';

export type LegalSection = { heading?: string; paragraphs: string[] };

export const PRIVACY_SECTIONS: Record<LandingLocale, LegalSection[]> = {
  zh: [
    {
      heading: '引言',
      paragraphs: [
        '欢迎使用 VoiceMind AI（以下简称「本服务」）。我们重视您的隐私。本隐私政策说明当您使用本网站与应用功能时，我们如何收集、使用、存储与保护信息。',
        '本服务由 Jack Zhong（个人）运营，常居地为中国香港特别行政区。如您对本政策或个人信息处理有疑问、或欲行使相关权利，请联系：carneyzz@foxmail.com。',
      ],
    },
    {
      heading: '我们收集的信息',
      paragraphs: [
        '账户与身份：若您通过第三方身份服务（如 Clerk）登录，我们会收到该服务提供的账户标识符、邮箱等您授权共享的资料，用于登录态与账户管理。',
        '您主动提供的内容：您口述、粘贴或提交的文本，以及您选择保存的本地历史记录（如浏览器 localStorage 中的摘要数据），用于在本设备上展示与您的操作相关的结果。',
        '技术与日志：浏览器可能向我们的托管环境发送常规访问日志（如 IP 大致区域、User-Agent、访问时间），用于安全与故障排查；具体范围取决于您部署服务的方式。',
        '麦克风：语音输入依赖浏览器语音识别与录音能力；音频处理在本地或按浏览器策略进行，我们不会要求超出实现功能所必需的权限说明之外的访问。',
      ],
    },
    {
      heading: 'AI 与第三方处理',
      paragraphs: [
        '当您使用「生成思维导图」「文档总结」等功能时，经过整理后的文本可能被发送至您配置的 AI 推理服务（例如 Google Gemini API），以生成结构化输出。该传输仅用于响应当次请求，请确保您已阅读相应模型服务商的条款与隐私政策。',
        '身份认证服务商（如 Clerk）按其独立政策处理登录数据；我们不会将口述内容出售给第三方用于广告画像。',
      ],
    },
    {
      heading: '存储与安全',
      paragraphs: [
        '历史记录默认保存在您的浏览器本地存储中，清除站点数据或更换设备可能导致记录丢失；若您未来使用云端同步，我们将在产品内另行说明。',
        '我们采取合理的技术与管理措施降低未授权访问风险，但互联网环境不存在绝对安全，请您勿在口述或粘贴区提交高度敏感信息（如银行卡完整号码、未公开的商业秘密）。',
      ],
    },
    {
      heading: '您的权利',
      paragraphs: [
        '在适用法律允许的范围内，您可请求查阅、更正或删除我们持有的与您账户相关的个人信息。《个人资料（私隐）条例》（香港法例第 486 章）下的权利（如适用）亦可能适用于您。请通过 carneyzz@foxmail.com 提交请求，我们将在合理期限内答复。',
        '您可随时通过浏览器设置清除本地存储，或通过账户提供商终止登录。',
      ],
    },
    {
      heading: '儿童',
      paragraphs: [
        '本服务面向具有完全民事行为能力的用户。若您为未成年人，请在监护人指导下使用。若我们发现无意中收集了儿童个人信息，将尽快删除。',
      ],
    },
    {
      heading: '跨境传输',
      paragraphs: [
        '若 AI 或认证服务商的服务器位于境外，您的数据可能跨境传输。我们将遵守适用法律要求并在必要时通过合同或标准条款保障安全。',
      ],
    },
    {
      heading: '政策更新',
      paragraphs: [
        '我们可能适时修订本政策，并在本页更新「最近更新」日期。重大变更时，我们将通过站内提示或其他合理方式告知。',
      ],
    },
  ],
  en: [
    {
      heading: 'Introduction',
      paragraphs: [
        'VoiceMind AI (“the Service”) respects your privacy. This policy explains what information we collect, how we use it, and your choices.',
        'The Service is operated by Jack Zhong, an individual based in the Hong Kong Special Administrative Region (“Hong Kong”). For privacy questions or to exercise your rights, contact: carneyzz@foxmail.com.',
      ],
    },
    {
      heading: 'Information we collect',
      paragraphs: [
        'Account data: If you sign in via a provider such as Clerk, we receive identifiers and profile fields you authorize for authentication and account management.',
        'Content you provide: Text from dictation, paste fields, or submissions, and optional local history stored in your browser (e.g., localStorage) to show your results.',
        'Technical data: Standard server or hosting logs may include approximate IP, user agent, and timestamps for security and reliability.',
        'Microphone: Voice features use browser APIs; we only request permissions needed for recording or speech recognition as described in the product.',
      ],
    },
    {
      heading: 'AI and third parties',
      paragraphs: [
        'When you run AI features, refined text may be sent to the AI backend you configure (e.g., Google Gemini) to produce mind maps or documents. That transmission is scoped to fulfilling your request. Review the provider’s terms and privacy notice.',
        'Authentication vendors process sign-in data under their own policies. We do not sell your dictation for ad profiling.',
      ],
    },
    {
      heading: 'Storage and security',
      paragraphs: [
        'History is stored locally in your browser unless we ship cloud sync (we will disclose it separately). Clearing site data may delete it.',
        'We use reasonable safeguards; no online service is perfectly secure. Avoid pasting highly sensitive secrets into the product.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'Where applicable law allows, you may request access to, correction of, or deletion of personal data we hold. Rights under Hong Kong’s Personal Data (Privacy) Ordinance (Cap. 486) may also apply. Email carneyzz@foxmail.com; we respond within a reasonable time.',
        'You can clear local storage or sign out at any time.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'The Service is not directed to children. If you believe we collected a child’s data by mistake, contact us and we will delete it.',
      ],
    },
    {
      heading: 'International transfers',
      paragraphs: [
        'Providers may process data in other countries. We comply with applicable law and use appropriate safeguards where required.',
      ],
    },
    {
      heading: 'Changes',
      paragraphs: [
        'We may update this policy and change the “Last updated” date. Material changes will be communicated as appropriate.',
      ],
    },
  ],
};

export const TERMS_SECTIONS: Record<LandingLocale, LegalSection[]> = {
  zh: [
    {
      heading: '接受条款',
      paragraphs: [
        '访问或使用 VoiceMind AI，即表示您同意本用户协议。若不同意，请停止使用。',
        '本服务由 Jack Zhong（个人，常居中国香港特别行政区）运营。您确认具备完全订立合同之行为能力，或已在监护人同意下使用。',
      ],
    },
    {
      heading: '服务说明',
      paragraphs: [
        '本服务提供基于语音与文本输入的思维导图生成、文档整理等能力，具体以当前产品界面为准。我们可能因维护、升级或不可抗力暂停部分功能。',
        'AI 输出由模型自动生成，可能存在不准确或不完整之处，不构成专业建议（法律、医疗、投资等）。您应自行核实重要事项。',
      ],
    },
    {
      heading: '账户与第三方登录',
      paragraphs: [
        '若使用 Clerk 等第三方登录，您须遵守该服务商的用户条款。您应妥善保管账户凭证，对账户下的行为负责。',
      ],
    },
    {
      heading: '用户内容与许可',
      paragraphs: [
        '您保留对提交内容（口述、粘贴文本等）的权利。为向您提供与改进服务，您授予我们在全球范围内、非独占、免版税的许可，以处理、存储（含本地或按产品设计的云端）与展示该内容，仅限于运营本服务之目的。',
        '您声明您有权提交相关内容，且内容不侵犯第三方权利、不违反法律法规。请勿输入违法、侵权或恶意代码。',
      ],
    },
    {
      heading: '禁止使用',
      paragraphs: [
        '禁止利用本服务从事违法活动、传播恶意软件、干扰服务安全、爬取导致不合理负载、或绕过访问控制。我们有权对违规账户采取限制或终止措施。',
      ],
    },
    {
      heading: '免责声明',
      paragraphs: [
        '在适用法律允许的最大范围内，本服务按「现状」提供，不对特定适用性、无错误或不中断作出保证。',
      ],
    },
    {
      heading: '责任限制',
      paragraphs: [
        '因使用或无法使用本服务所产生的间接、附带、特殊或后果性损害，在法律允许的范围内我们可能不承担责任；我们的总责任以您就争议服务在过往十二个月内实际支付的费用为上限（若当前为免费服务，则以港币一百元（HK$100）为上限，以法律不禁止的较低者为准）。',
      ],
    },
    {
      heading: '终止',
      paragraphs: [
        '您可随时停止使用。我们可在通知或不通知的情况下暂停或终止违反本协议的使用行为。',
      ],
    },
    {
      heading: '适用法律与争议',
      paragraphs: [
        '本协议受中华人民共和国香港特别行政区法律管辖并据其解释。因本协议引起或与之相关的争议，双方同意提交香港特别行政区法院的非专属司法管辖（non-exclusive jurisdiction）。',
      ],
    },
    {
      heading: '联系方式',
      paragraphs: [
        '与本协议相关的问题请联系：carneyzz@foxmail.com。',
      ],
    },
  ],
  en: [
    {
      heading: 'Acceptance',
      paragraphs: [
        'By using VoiceMind AI you agree to these Terms. If you disagree, do not use the Service.',
        'The Service is operated by Jack Zhong, an individual based in the Hong Kong Special Administrative Region. You represent that you have capacity to contract or use the Service with guardian consent.',
      ],
    },
    {
      heading: 'The Service',
      paragraphs: [
        'We provide AI-assisted mind maps and document structuring from voice/text as shown in the product. Features may change; maintenance or force majeure may interrupt access.',
        'Outputs are machine-generated and may be wrong or incomplete. They are not professional advice; verify important decisions independently.',
      ],
    },
    {
      heading: 'Accounts',
      paragraphs: [
        'Third-party login (e.g., Clerk) is governed by that provider’s terms. Keep credentials secure and accept responsibility for activity under your account.',
      ],
    },
    {
      heading: 'Your content',
      paragraphs: [
        'You retain rights to your content. You grant us a worldwide, non-exclusive, royalty-free license to process, store, and display it solely to operate and improve the Service.',
        'You represent you have rights to submit the content and that it is lawful. Do not upload malware or infringing material.',
      ],
    },
    {
      heading: 'Prohibited use',
      paragraphs: [
        'No unlawful activity, security attacks, excessive automated scraping, or circumvention of access controls. We may suspend or terminate violations.',
      ],
    },
    {
      heading: 'Disclaimer',
      paragraphs: [
        'To the fullest extent permitted by law, the Service is provided “as is” without warranties of merchantability, fitness, or uninterrupted operation.',
      ],
    },
    {
      heading: 'Limitation of liability',
      paragraphs: [
        'We are not liable for indirect or consequential damages where allowed by law. Total liability is capped at fees you paid in the twelve months before the claim (or, if the Service is free, HK$100, whichever cap applicable law permits).',
      ],
    },
    {
      heading: 'Termination',
      paragraphs: [
        'You may stop using the Service anytime. We may suspend or terminate use that breaches these Terms.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        'These Terms are governed by the laws of the Hong Kong Special Administrative Region of the People’s Republic of China. You agree to the non-exclusive jurisdiction of the courts of Hong Kong for disputes arising from or relating to these Terms.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        'Questions: carneyzz@foxmail.com.',
      ],
    },
  ],
};
