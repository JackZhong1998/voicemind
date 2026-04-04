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
