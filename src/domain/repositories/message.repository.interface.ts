import { Message } from '../entities/message.entity';
import { MessageRole } from '../enums/message-role.enum';

/**
 * MessageRepository Interface
 *
 * Define o contrato para persistência de mensagens.
 * Entidade filha de Conversation.
 */
export interface MessageRepository {
  /**
   * Salva uma mensagem (cria ou atualiza).
   */
  save(message: Message): Promise<void>;

  /**
   * Busca uma mensagem pelo ID.
   */
  findById(id: string): Promise<Message | null>;

  /**
   * Lista mensagens de uma conversa.
   */
  findByConversationId(conversationId: string): Promise<Message[]>;

  /**
   * Lista mensagens por role (user/assistant).
   */
  findByConversationIdAndRole(
    conversationId: string,
    role: MessageRole,
  ): Promise<Message[]>;

  /**
   * Busca a última mensagem de uma conversa.
   */
  findLastByConversationId(conversationId: string): Promise<Message | null>;

  /**
   * Remove uma mensagem (soft delete).
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se uma mensagem existe.
   */
  existsById(id: string): Promise<boolean>;
}