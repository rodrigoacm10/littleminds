/**
 * PostSupport Entity
 *
 * Representa um "abraço virtual" ou apoio de um usuário a um post.
 * É uma entidade de relacionamento que expressa solidariedade da comunidade.
 *
 * Contexto de negócio:
 * - Usuários podem demonstrar apoio a posts significativos
 * - Diferente de "likes", representa empatia e suporte emocional
 * - Um usuário só pode dar um support por post
 *
 * Invariantes protegidas:
 * - Usuário único por post (constraint de unicidade)
 * - Imutável após criação (não há update)
 */
export class PostSupport {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _postId: string;
  private readonly _createdAt: Date;

  private constructor(id: string, userId: string, postId: string, createdAt: Date) {
    this._id = id;
    this._userId = userId;
    this._postId = postId;
    this._createdAt = createdAt;
  }

  /**
   * Factory method para criar um novo apoio.
   * Esta entidade é imutável - não há métodos de atualização.
   */
  static create(id: string, userId: string, postId: string): PostSupport | null {
    if (!id || id.trim().length === 0) {
      return null;
    }

    if (!userId || userId.trim().length === 0) {
      return null;
    }

    if (!postId || postId.trim().length === 0) {
      return null;
    }

    return new PostSupport(id, userId, postId, new Date());
  }

  /**
   * Reconstrói a entidade a partir de dados persistidos.
   */
  static reconstitute(
    id: string,
    userId: string,
    postId: string,
    createdAt: Date,
  ): PostSupport {
    return new PostSupport(id, userId, postId, createdAt);
  }

  // Getters (somente leitura - entidade imutável)

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get postId(): string {
    return this._postId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Verifica se este support pertence a um usuário específico.
   * Útil para verificar se usuário já apoiou um post.
   */
  belongsToUser(userId: string): boolean {
    return this._userId === userId;
  }

  /**
   * Verifica se este support é para um post específico.
   */
  isForPost(postId: string): boolean {
    return this._postId === postId;
  }

  equals(other: PostSupport): boolean {
    return this._id === other._id;
  }

  /**
   * Comparação por unicidade usuário/post.
   * Útil para verificar duplicatas antes de persistir.
   */
  hasSameUserAndPost(other: PostSupport): boolean {
    return this._userId === other._userId && this._postId === other._postId;
  }

  toPersistence(): {
    id: string;
    userId: string;
    postId: string;
    createdAt: Date;
  } {
    return {
      id: this._id,
      userId: this._userId,
      postId: this._postId,
      createdAt: this._createdAt,
    };
  }
}