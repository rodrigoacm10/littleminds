import { Conversation } from '../entities/conversation.entity';

/**
 * ConversationRepository Interface
 *
 * Define o contrato para persistência de conversas.
 * Aggregate Root: Conversation (contém Messages)
 */
export interface ConversationRepository {
  /**
   * Salva uma conversa (cria ou atualiza).
   */
  save(conversation: Conversation): Promise<void>;

  /**
   * Busca uma conversa pelo ID.
   */
  findById(id: string): Promise<Conversation | null>;

  /**
   * Lista conversas de um usuário.
   */
  findByUserId(userId: string): Promise<Conversation[]>;

  /**
   * Lista conversas não arquivadas de um usuário.
   */
  findActiveByUserId(userId: string): Promise<Conversation[]>;

  /**
   * Lista conversas arquivadas de um usuário.
   */
  findArchivedByUserId(userId: string): Promise<Conversation[]>;

  /**
   * Remove uma conversa.
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se uma conversa existe.
   */
  existsById(id: string): Promise<boolean>;
}