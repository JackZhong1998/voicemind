export interface MindMapNode {
  id: string;
  label: string;
  notes?: string;
  children?: MindMapNode[];
}

export interface MindMapData {
  root: MindMapNode;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  /** 语音识别原始文本 */
  transcriptRaw: string;
  /** 经模型润色后的展示/导图用文本 */
  transcriptDisplay: string;
  /** 思维导图（与 documentSummary 至少存其一） */
  mindMapData?: MindMapNode;
  /** 文档总结（Markdown） */
  documentSummary?: string;
  /** 录音数据 URL（浏览器多为 WebM/Opus 或 AAC，非真正 MP3 时亦存此字段） */
  audioDataUrl: string;
  audioMimeType: string;
  /** @deprecated 旧版仅 transcript，加载时迁移 */
  transcript?: string;
}

export type RecordingStatus = 'idle' | 'recording' | 'paused';

/** 语音任务模式：对话消息 */
export interface AgentChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

/** 语音任务模式：执行 Agent 待办项 */
export type AgentTodoStatus = 'pending' | 'running' | 'done' | 'error';

export interface AgentTodoItem {
  id: string;
  title: string;
  /** 对话 Agent 给出的执行说明（可选） */
  detail?: string;
  status: AgentTodoStatus;
  /** 执行 Agent 输出的 Markdown */
  result?: string;
  errorMessage?: string;
}
