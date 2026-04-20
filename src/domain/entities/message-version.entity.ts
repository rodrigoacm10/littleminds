/**
 * MessageVersion Entity
 *
 * Representa uma versão de uma mensagem.
 * Permite rastrear o histórico de edições de uma mensagem.
 *
 * Contexto de negócio:
 * - Cada mensagem pode ter múltiplas versões
 * - A versão mais recente representa o conteúdo atual
 * - Histórico preservado para auditoria
 * - editedBy indica quem fez a alteração (user ou system)
 *
 * Design Pattern: Memento / Version History
 * - Permite desfazer/refazer edições
 * - Auditoria completa de alterações
 * - Não há deleção de versões anteriores
 *
 * Invariantes protegidas:
 * - Mensagem obrigatória
 * - Conteúdo obrigatório
 * - editedBy obrigatório
 * - Imutável após criação
 */
export class MessageVersion {
  private readonly _id: string;
  private readonly _messageId: string;
  private readonly _content: string;
  private readonly _editedBy: string;
  private readonly _createdAt: Date;

  private constructor(
    id: string,
    messageId: string,
    content: string,
    editedBy: string,
    createdAt: Date,
  ) {
    this._id = id;
    this._messageId = messageId;
    this._content = content;
    this._editedBy = editedBy;
    this._createdAt = createdAt;
  }

  /**
   * Factory method para criar uma nova versão de mensagem.
   *
   * @param id - Identificador único da versão
   * @param messageId - ID da mensagem pai
   * @param content - Conteúdo da versão
   * @param editedBy - Quem editou ('user' ou 'system')
   */
  static create(
    id: string,
    messageId: string,
    content: string,
    editedBy: string,
  ): MessageVersion | null {
    if (!id || id.trim().length === 0) {
      return null;
    }

    if (!messageId || messageId.trim().length === 0) {
      return null;
    }

    if (!content || content.trim().length === 0) {
      return null;
    }

    if (!editedBy || editedBy.trim().length === 0) {
      return null;
    }

    return new MessageVersion(id, messageId, content.trim(), editedBy.trim(), new Date());
  }

  /**
   * Reconstrói a entidade a partir de dados persistidos.
   */
  static reconstitute(
    id: string,
    messageId: string,
    content: string,
    editedBy: string,
    createdAt: Date,
  ): MessageVersion {
    return new MessageVersion(id, messageId, content, editedBy, createdAt);
  }

  // Getters (somente leitura - entidade imutável)

  get id(): string {
    return this._id;
  }

  get messageId(): string {
    return this._messageId;
  }

  get content(): string {
    return this._content;
  }

  get editedBy(): string {
    return this._editedBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Verifica se a versão foi editada pelo usuário.
   */
  isEditedByUser(): boolean {
    return this._editedBy === 'user';
  }

  /**
   * Verifica se a versão foi editada pelo sistema.
   */
  isEditedBySystem(): boolean {
    return this._editedBy === 'system';
  }

  /**
   * Verifica se pertence a uma mensagem específica.
   */
  belongsToMessage(messageId: string): boolean {
    return this._messageId === messageId;
  }

  equals(other: MessageVersion): boolean {
    return this._id === other._id;
  }

  toPersistence(): {
    id: string;
    messageId: string;
    content: string;
    editedBy: string;
    createdAt: Date;
  } {
    return {
      id: this._id,
      messageId: this._messageId,
      content: this._content,
      editedBy: this._editedBy,
      createdAt: this._createdAt,
    };
  }
}