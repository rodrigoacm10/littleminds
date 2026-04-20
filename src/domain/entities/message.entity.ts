import { MessageRole } from '../enums/message-role.enum';

/**
 * Message Entity
 *
 * Representa uma mensagem dentro de uma conversa.
 * Suporta versionamento para edição de mensagens.
 *
 * Contexto de negócio:
 * - Mensagens podem ser do usuário ou do assistente (IA)
 * - Mensagens podem ser "deletadas" (soft delete)
 * - Histórico de versões é preservado (MessageVersion)
 *
 * Design Pattern: Event Sourcing parcial
 * - O conteúdo atual está na versão mais recente
 * - Histórico de edições é preservado
 * - Permite auditoria e recuperação de mensagens
 *
 * Invariantes protegidas:
 * - Conversa obrigatória
 * - Role obrigatório
 * - Conteúdo via versões (não armazenado diretamente)
 */
export class Message {
  private readonly _id: string;
  private readonly _conversationId: string;
  private readonly _role: MessageRole;
  private _isDeleted: boolean;
  private readonly _createdAt: Date;

  private constructor(
    id: string,
    conversationId: string,
    role: MessageRole,
    isDeleted: boolean,
    createdAt: Date,
  ) {
    this._id = id;
    this._conversationId = conversationId;
    this._role = role;
    this._isDeleted = isDeleted;
    this._createdAt = createdAt;
  }

  /**
   * Factory method para criar uma nova mensagem.
   * O conteúdo inicial deve ser criado como MessageVersion separadamente.
   */
  static create(
    id: string,
    conversationId: string,
    role: MessageRole,
  ): Message | null {
    if (!id || id.trim().length === 0) {
      return null;
    }

    if (!conversationId || conversationId.trim().length === 0) {
      return null;
    }

    return new Message(id, conversationId, role, false, new Date());
  }

  /**
   * Reconstrói a entidade a partir de dados persistidos.
   */
  static reconstitute(
    id: string,
    conversationId: string,
    role: MessageRole,
    isDeleted: boolean,
    createdAt: Date,
  ): Message {
    return new Message(id, conversationId, role, isDeleted, createdAt);
  }

  // Getters

  get id(): string {
    return this._id;
  }

  get conversationId(): string {
    return this._conversationId;
  }

  get role(): MessageRole {
    return this._role;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Métodos de Domínio

  /**
   * Marca a mensagem como deletada (soft delete).
   * A mensagem permanece no banco mas não é exibida.
   */
  delete(): void {
    this._isDeleted = true;
  }

  /**
   * Restaura uma mensagem deletada.
   */
  restore(): void {
    this._isDeleted = false;
  }

  /**
   * Verifica se a mensagem é do usuário.
   */
  isFromUser(): boolean {
    return this._role === MessageRole.USER;
  }

  /**
   * Verifica se a mensagem é do assistente.
   */
  isFromAssistant(): boolean {
    return this._role === MessageRole.ASSISTANT;
  }

  /**
   * Verifica se a mensagem pertence a uma conversa específica.
   */
  belongsToConversation(conversationId: string): boolean {
    return this._conversationId === conversationId;
  }

  /**
   * Verifica se a mensagem está ativa (não deletada).
   */
  isActive(): boolean {
    return !this._isDeleted;
  }

  equals(other: Message): boolean {
    return this._id === other._id;
  }

  toPersistence(): {
    id: string;
    conversationId: string;
    role: MessageRole;
    isDeleted: boolean;
    createdAt: Date;
  } {
    return {
      id: this._id,
      conversationId: this._conversationId,
      role: this._role,
      isDeleted: this._isDeleted,
      createdAt: this._createdAt,
    };
  }
}