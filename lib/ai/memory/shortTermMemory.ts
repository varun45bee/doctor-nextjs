/**
 * Layer 1: Short-Term Memory
 * Maintains active sliding window of recent conversation messages with role, content and timestamps.
 */

export interface ChatMessageTurn {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface ShortTermMemoryOptions {
  maxTurns?: number;
}

export class ShortTermMemory {
  private messages: ChatMessageTurn[] = [];
  private maxTurns: number;

  constructor(options: ShortTermMemoryOptions = {}) {
    this.maxTurns = options.maxTurns || 10;
  }

  public addMessage(role: "user" | "assistant", content: string, metadata?: Record<string, unknown>): void {
    this.messages.push({
      role,
      content,
      timestamp: new Date().toISOString(),
      metadata,
    });

    if (this.messages.length > this.maxTurns) {
      this.messages = this.messages.slice(-this.maxTurns);
    }
  }

  public getMessages(): ChatMessageTurn[] {
    return [...this.messages];
  }

  public setMessages(messages: ChatMessageTurn[]): void {
    this.messages = messages.slice(-this.maxTurns);
  }

  public getTurnCount(): number {
    return this.messages.length;
  }

  public clear(): void {
    this.messages = [];
  }
}

