import { MessageVersion } from '../entities/message-version.entity';

/**
 * MessageVersionRepository Interface
 *
 * Define o contrato para persistência de versões de mensagens.
 * Entidade para histórico de edições.
 */
export interface MessageVersionRepository {
  /**
   * Salva uma versão de mensagem.
   */
  save(version: MessageVersion): Promise<void>;

  /**
   * Busca uma versão pelo ID.
   */
  findById(id: string): Promise<MessageVersion | null>;

  /**
   * Lista todas as versões de uma mensagem.
   */
  findByMessageId(messageId: string): Promise<MessageVersion[]>;

  /**
   * Busca a versão mais recente de uma mensagem.
   */
  findLatestByMessageId(messageId: string): Promise<MessageVersion | null>;

  /**
   * Remove uma versão.
   */
  delete(id: string): Promise<void>;
}