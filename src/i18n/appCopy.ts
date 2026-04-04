import type { LandingLocale } from './landingCopy';

export type AppLocale = LandingLocale;

export const APP_COPY: Record<
  AppLocale,
  {
    voiceInputTitle: string;
    homeAria: string;
    historyAria: string;
    newSessionAria: string;
    transcriptPlaceholder: string;
    supplementaryLabel: string;
    supplementaryPlaceholder: string;
    autoGenerate: string;
    autoGenerateTooltip: string;
    startRecordAria: string;
    pauseAria: string;
    resumeAria: string;
    resetAria: string;
    generateMindMap: string;
    generateDocumentSummary: string;
    generating: string;
    micDenied: string;
    mindMapEmpty: string;
    historyTitle: string;
    historyEmpty: string;
    storageFull: string;
    generateFailed: string;
    generateDocFailed: string;
    previewTabMindMap: string;
    previewTabDocument: string;
    previewTabListAria: string;
    exportLabel: string;
    exportOutlineMd: string;
    exportJson: string;
    docExport: string;
    docMd: string;
    docTxt: string;
    docCopy: string;
    docCopied: string;
    docEmptyHint: string;
    docPlaceholder: string;
    docPlaceholderLoading: string;
    aiLogsTitle: string;
    aiLogsTooltip: string;
    debugEmpty: string;
    debugCopyAll: string;
    debugCopyAllTitle: string;
    debugCopied: string;
    debugClear: string;
    debugCopyJson: string;
  }
> = {
  zh: {
    voiceInputTitle: '语音输入',
    homeAria: '返回首页',
    historyAria: '历史记录',
    newSessionAria: '新会话',
    transcriptPlaceholder:
      '开始录音后，转写会显示在这里；提交后会自动加标点并轻量纠错。',
    supplementaryLabel: '补充材料（可选，粘贴文本）',
    supplementaryPlaceholder:
      '可粘贴背景资料、提纲、术语表等。生成思维导图与文档总结时，会一并写入模型 system prompt 作为参考（不会单独当作用户指令执行）。',
    autoGenerate: '自动更新生成',
    autoGenerateTooltip:
      '开启：录音时随说话内容自动重新生成右侧导图或文档，无需每次点「生成」。关闭：仅在点击「生成」时更新。',
    startRecordAria: '开始录音',
    pauseAria: '暂停',
    resumeAria: '继续',
    resetAria: '重置',
    generateMindMap: '生成思维导图',
    generateDocumentSummary: '生成文档总结',
    generating: '生成中…',
    micDenied: '无法访问麦克风，请检查权限设置。',
    mindMapEmpty: '录制或输入内容并生成后，思维导图将显示在此处',
    historyTitle: '历史记录',
    historyEmpty: '暂无历史',
    storageFull: '本地存储空间不足，无法保存全部历史录音，请删除部分记录。',
    generateFailed: '生成思维导图失败，请重试。',
    generateDocFailed: '生成文档总结失败，请重试。',
    previewTabMindMap: '思维导图',
    previewTabDocument: '文档总结',
    previewTabListAria: '预览类型',
    exportLabel: '导出',
    exportOutlineMd: '大纲 MD',
    exportJson: 'JSON',
    docExport: '导出',
    docMd: 'Markdown',
    docTxt: '纯文本',
    docCopy: '复制',
    docCopied: '已复制',
    docEmptyHint:
      '选择「文档总结」后输入或录制内容，将在此生成可编辑的正式文档',
    docPlaceholder: '文档内容将显示在这里，可直接修改…',
    docPlaceholderLoading: '正在生成文档…',
    aiLogsTitle: 'AI 响应日志',
    aiLogsTooltip: 'AI 日志',
    debugEmpty: '暂无日志。生成一次思维导图后可查看原始数据。',
    debugCopyAll: '全部',
    debugCopyAllTitle: '复制全部',
    debugCopied: '已复制',
    debugClear: '清空',
    debugCopyJson: '复制 JSON',
  },
  en: {
    voiceInputTitle: 'Voice input',
    homeAria: 'Back to home',
    historyAria: 'History',
    newSessionAria: 'New session',
    transcriptPlaceholder:
      'Transcript appears while you speak; after submit we add punctuation and light cleanup.',
    supplementaryLabel: 'Extra context (optional paste)',
    supplementaryPlaceholder:
      'Paste background notes, outlines, glossaries, etc. Included in the model system prompt when generating mind maps and documents (reference only—not executed as commands).',
    autoGenerate: 'Auto-update while recording',
    autoGenerateTooltip:
      'On: while recording, the mind map or document refreshes as you speak—no need to tap Generate every time. Off: updates only when you tap Generate.',
    startRecordAria: 'Start recording',
    pauseAria: 'Pause',
    resumeAria: 'Resume',
    resetAria: 'Reset',
    generateMindMap: 'Generate mind map',
    generateDocumentSummary: 'Generate document',
    generating: 'Generating…',
    micDenied: 'Microphone access denied. Check your browser permissions.',
    mindMapEmpty: 'Your mind map will appear here after you record and generate.',
    historyTitle: 'History',
    historyEmpty: 'No history yet',
    storageFull: 'Storage is full; remove some history to save new recordings.',
    generateFailed: 'Could not generate the mind map. Please try again.',
    generateDocFailed: 'Could not generate the document summary. Please try again.',
    previewTabMindMap: 'Mind map',
    previewTabDocument: 'Document',
    previewTabListAria: 'Preview type',
    exportLabel: 'Export',
    exportOutlineMd: 'Outline (.md)',
    exportJson: 'JSON',
    docExport: 'Export',
    docMd: 'Markdown',
    docTxt: 'Plain text',
    docCopy: 'Copy',
    docCopied: 'Copied',
    docEmptyHint:
      'Switch to Document, then record or paste content to generate an editable summary here.',
    docPlaceholder: 'Document text appears here — you can edit it.',
    docPlaceholderLoading: 'Generating document…',
    aiLogsTitle: 'AI response logs',
    aiLogsTooltip: 'AI logs',
    debugEmpty: 'No logs yet. Generate a mind map to see raw data.',
    debugCopyAll: 'All',
    debugCopyAllTitle: 'Copy all',
    debugCopied: 'Copied',
    debugClear: 'Clear',
    debugCopyJson: 'Copy JSON',
  },
};
