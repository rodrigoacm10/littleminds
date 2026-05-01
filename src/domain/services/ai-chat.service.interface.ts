import { MessageRole } from '../enums/message-role.enum';

export interface AIChatMessage {
  role: MessageRole;
  content: string;
}

export interface AIChatService {
  generateReply(messages: AIChatMessage[]): Promise<string>;
}

export const AI_CHAT_SERVICE = Symbol('AI_CHAT_SERVICE');
