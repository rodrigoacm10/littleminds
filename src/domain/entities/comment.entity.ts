/**
 * Comment Entity
 *
 * Representa um comentário em um post do fórum.
 * Entidade filha do agregado ForumPost.
 *
 * Contexto de negócio:
 * - Permite que a comunidade interaja com posts
 * - Respostas e discussões sobre experiências compartilhadas
 * - Pertence a um post específico e a um autor
 *
 * Nota: Esta entidade existe dentro do agregado ForumPost,
 * mas é acessada através de um repositório próprio para
 * paginação e performance.
 */
export class Comment {
  private readonly _id: string;
  private _content: string;
  private readonly _postId: string;
  private readonly _authorId: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    content: string,
    postId: string,
    authorId: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._content = content;
    this._postId = postId;
    this._authorId = authorId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method para criar um novo comentário.
   */
  static create(
    id: string,
    content: string,
    postId: string,
    authorId: string,
  ): Comment | null {
    if (!id || id.trim().length === 0) {
      return null;
    }

    if (!content || content.trim().length === 0) {
      return null;
    }

    if (!postId || postId.trim().length === 0) {
      return null;
    }

    if (!authorId || authorId.trim().length === 0) {
      return null;
    }

    const now = new Date();

    return new Comment(id, content.trim(), postId, authorId, now, now);
  }

  /**
   * Reconstrói a entidade a partir de dados persistidos.
   */
  static reconstitute(
    id: string,
    content: string,
    postId: string,
    authorId: string,
    createdAt: Date,
    updatedAt: Date,
  ): Comment {
    return new Comment(id, content, postId, authorId, createdAt, updatedAt);
  }

  // Getters

  get id(): string {
    return this._id;
  }

  get content(): string {
    return this._content;
  }

  get postId(): string {
    return this._postId;
  }

  get authorId(): string {
    return this._authorId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de Domínio

  /**
   * Atualiza o conteúdo do comentário.
   */
  updateContent(newContent: string): boolean {
    if (!newContent || newContent.trim().length === 0) {
      return false;
    }

    this._content = newContent.trim();
    this._updatedAt = new Date();
    return true;
  }

  /**
   * Verifica se um usuário é o autor do comentário.
   */
  isAuthoredBy(userId: string): boolean {
    return this._authorId === userId;
  }

  equals(other: Comment): boolean {
    return this._id === other._id;
  }

  toPersistence(): {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      content: this._content,
      postId: this._postId,
      authorId: this._authorId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}