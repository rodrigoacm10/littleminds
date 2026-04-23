/**
 * Conversation Entity
 *
 * Representa uma conversa do chatbot com IA.
 * Agregado raiz para mensagens.
 *
 * Contexto de negócio:
 * - Usuários podem ter múltiplas conversas
 * - Conversas podem ser arquivadas para organização
 * - Cada conversa contém um histórico de mensagens
 *
 * Invariantes protegidas:
 * - Título obrigatório
 * - Usuário obrigatório
 * - isArchived controla visibilidade na lista principal
 */
export class Conversation {
  private readonly _id: string;
  private readonly _userId: string;
  private _title: string;
  private _isArchived: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    userId: string,
    title: string,
    isArchived: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._userId = userId;
    this._title = title;
    this._isArchived = isArchived;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method para criar uma nova conversa.
   */
  static create(id: string, userId: string, title: string): Conversation | null {
    if (!id || id.trim().length === 0) {
      return null;
    }

    if (!userId || userId.trim().length === 0) {
      return null;
    }

    if (!title || title.trim().length === 0) {
      return null;
    }

    const now = new Date();

    return new Conversation(id, userId, title.trim(), false, now, now);
  }

  /**
   * Reconstrói a entidade a partir de dados persistidos.
   */
  static reconstitute(
    id: string,
    userId: string,
    title: string,
    isArchived: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Conversation {
    return new Conversation(id, userId, title, isArchived, createdAt, updatedAt);
  }

  // Getters

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get isArchived(): boolean {
    return this._isArchived;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de Domínio

  /**
   * Atualiza o título da conversa.
   */
  updateTitle(newTitle: string): boolean {
    if (!newTitle || newTitle.trim().length === 0) {
      return false;
    }

    this._title = newTitle.trim();
    this._updatedAt = new Date();
    return true;
  }

  /**
   * Arquiva a conversa.
   * Conversas arquivadas não aparecem na lista principal.
   */
  archive(): void {
    this._isArchived = true;
    this._updatedAt = new Date();
  }

  /**
   * Restaura a conversa do arquivo.
   * Volta a aparecer na lista principal.
   */
  unarchive(): void {
    this._isArchived = false;
    this._updatedAt = new Date();
  }

  /**
   * Verifica se a conversa pertence a um usuário.
   */
  belongsToUser(userId: string): boolean {
    return this._userId === userId;
  }

  /**
   * Verifica se a conversa está ativa (não arquivada).
   */
  isActive(): boolean {
    return !this._isArchived;
  }

  equals(other: Conversation): boolean {
    return this._id === other._id;
  }

  toPersistence(): {
    id: string;
    userId: string;
    title: string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      userId: this._userId,
      title: this._title,
      isArchived: this._isArchived,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}