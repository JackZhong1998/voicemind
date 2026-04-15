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
    workspaceModeCreate: string;
    workspaceModeAgent: string;
    workspaceModeAria: string;
    agentVoicePanelTitle: string;
    agentSendToAi: string;
    agentTranscriptPlaceholder: string;
    agentChatTitle: string;
    agentConversationAgentBadge: string;
    agentExecutionAgentBadge: string;
    agentChatEmpty: string;
    agentPlanning: string;
    agentPlanFailed: string;
    agentNoPlanYet: string;
    agentTodoTitle: string;
    agentTodoEmpty: string;
    agentTodoStatusPending: string;
    agentTodoStatusRunning: string;
    agentTodoStatusDone: string;
    agentTodoStatusError: string;
    agentTodoPanelAria: string;
    agentWorkspaceBlurb: string;
    agentExecResultLoading: string;
    agentExecResultPlaceholder: string;
    agentExecErrorFallback: string;
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
      '可粘贴背景资料、提纲、术语表等。生成思维导图与文档时，会一并写入模型 system prompt 作为参考（不会单独当作用户指令执行）。',
    autoGenerate: '自动更新生成',
    autoGenerateTooltip:
      '开启：录音时随说话内容自动重新生成右侧导图或文档，无需每次点「生成」。关闭：仅在点击「生成」时更新。',
    startRecordAria: '开始录音',
    pauseAria: '暂停',
    resumeAria: '继续',
    resetAria: '重置',
    generateMindMap: '生成思维导图',
    generateDocumentSummary: '生成文档',
    generating: '生成中…',
    micDenied: '无法访问麦克风，请检查权限设置。',
    mindMapEmpty: '录制或输入内容并生成后，思维导图将显示在此处',
    historyTitle: '历史记录',
    historyEmpty: '暂无历史',
    storageFull: '本地存储空间不足，无法保存全部历史录音，请删除部分记录。',
    generateFailed: '生成思维导图失败，请重试。',
    generateDocFailed: '生成文档失败，请重试。',
    previewTabMindMap: '思维导图',
    previewTabDocument: '文档',
    previewTabListAria: '预览类型',
    exportLabel: '导出',
    exportOutlineMd: '大纲 MD',
    exportJson: 'JSON',
    docExport: '导出',
    docMd: 'Markdown',
    docTxt: '纯文本',
    docCopy: '复制',
    docCopied: '已复制',
    docEmptyHint: '选择「文档」后输入或录制内容，将在此生成可编辑正文',
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
    workspaceModeCreate: '文档与导图',
    workspaceModeAgent: '语音任务',
    workspaceModeAria: '工作区模式',
    agentVoicePanelTitle: '语音任务',
    agentSendToAi: '发送给 AI 规划',
    agentTranscriptPlaceholder:
      '口述你的复杂任务；暂停后点击发送。对话 Agent 会回复并生成右侧待办，点击待办由执行 Agent 产出结果。',
    agentChatTitle: '对话',
    agentConversationAgentBadge: '对话 Agent',
    agentExecutionAgentBadge: '执行 Agent',
    agentChatEmpty:
      '用左侧语音下达较长任务。AI 会分解为右侧待办；点按待办即可展开执行结果。',
    agentPlanning: '正在分解任务并生成待办…',
    agentPlanFailed: '对话 Agent 规划失败，请重试。',
    agentNoPlanYet: '请先发送至少一条任务，生成待办列表后再执行。',
    agentTodoTitle: '待办',
    agentTodoEmpty: '发送任务后，待办会出现在这里。',
    agentTodoStatusPending: '点击运行执行 Agent',
    agentTodoStatusRunning: '执行中…',
    agentTodoStatusDone: '已完成 · 点击展开/收起',
    agentTodoStatusError: '失败 · 点击重试',
    agentTodoPanelAria: '任务待办与执行结果',
    agentWorkspaceBlurb: '对话 Agent 规划待办；点击项由执行 Agent 生成结果。',
    agentExecResultLoading: '执行 Agent 正在生成结果…',
    agentExecResultPlaceholder: '展开后自动调用执行 Agent；结果将显示在这里。',
    agentExecErrorFallback: '执行失败，请重试或检查网络与 API Key。',
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
    generateDocFailed: 'Could not generate the document. Please try again.',
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
    workspaceModeCreate: 'Doc & mind map',
    workspaceModeAgent: 'Voice tasks',
    workspaceModeAria: 'Workspace mode',
    agentVoicePanelTitle: 'Voice tasks',
    agentSendToAi: 'Send to AI',
    agentTranscriptPlaceholder:
      'Describe a complex task by voice, then send. The conversation agent replies and fills the todo list; tap a todo to run the execution agent.',
    agentChatTitle: 'Chat',
    agentConversationAgentBadge: 'Chat agent',
    agentExecutionAgentBadge: 'Worker agent',
    agentChatEmpty:
      'Use voice on the left for a longer task. AI will create todos on the right; tap one to expand results.',
    agentPlanning: 'Planning tasks…',
    agentPlanFailed: 'The conversation agent could not plan. Please try again.',
    agentNoPlanYet: 'Send a task first to generate todos before running execution.',
    agentTodoTitle: 'Todos',
    agentTodoEmpty: 'Todos will appear after you send a task.',
    agentTodoStatusPending: 'Tap to run worker agent',
    agentTodoStatusRunning: 'Running…',
    agentTodoStatusDone: 'Done · tap to expand/collapse',
    agentTodoStatusError: 'Failed · tap to retry',
    agentTodoPanelAria: 'Task todos and execution results',
    agentWorkspaceBlurb: 'Chat agent plans todos; tap an item for the worker agent output.',
    agentExecResultLoading: 'Worker agent is generating output…',
    agentExecResultPlaceholder: 'Expand to run the worker agent; results appear here.',
    agentExecErrorFallback: 'Execution failed. Retry or check network/API key.',
  },
};
