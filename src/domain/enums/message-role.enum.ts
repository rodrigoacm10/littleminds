/**
 * MessageRole Enum
 *
 * Define quem enviou uma mensagem em uma conversa.
 * Usado no sistema de chatbot com IA para distinguir
 * mensagens do usuário daquelas geradas pelo assistente.
 *
 * Segue o padrão de APIs de chat (OpenAI, Anthropic, etc.)
 */
export enum MessageRole {
  /**
   * Mensagem do usuário (pai/responsável).
   * Input do usuário no chatbot.
   */
  USER = 'user',

  /**
   * Mensagem do assistente (IA).
   * Resposta gerada pelo sistema de IA.
   */
  ASSISTANT = 'assistant',
}

/**
 * Utilitário para verificar se um valor é um MessageRole válido.
 */
export function isValidMessageRole(value: string): value is MessageRole {
  return Object.values(MessageRole).includes(value as MessageRole);
}