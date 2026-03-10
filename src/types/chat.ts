export type Phase = "idle" | "solving" | "verifying" | "debating" | "consensus";

export type MessageRole = "user" | "model-a" | "model-b" | "orchestrator";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  phase: Phase;
  timestamp: Date;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
}
