import { AgeGroup } from '../enums/age-group.enum';

/**
 * ForumPost Entity
 *
 * Representa um post no fórum da comunidade.
 * É o agregado raiz para Comentários e Supports.
 *
 * Contexto de negócio:
 * - Pais compartilham experiências e vivências
 * - Posts podem ser categorizados por faixa etária
 * - A comunidade pode dar "abraços virtuais" (supports)
 *
 * Invariantes protegidas:
 * - Título obrigatório
 * - Conteúdo obrigatório
 * - Autor obrigatório
 * - AgeGroup é opcional (null permitido)
 */
export class ForumPost {
  private readonly _id: string;
  private _title: string;
  private _content: string;
  private readonly _authorId: string;
  private _ageGroup: AgeGroup | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    title: string,
    content: string,
    authorId: string,
    ageGroup: AgeGroup | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._title = title;
    this._content = content;
    this._authorId = authorId;
    this._ageGroup = ageGroup;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method para criar um novo post.
   */
  static create(
    id: string,
    title: string,
    content: string,
    authorId: string,
    ageGroup?: AgeGroup,
  ): ForumPost | null {
    if (!id || id.trim().length === 0) {
      return null;
    }

    if (!title || title.trim().length === 0) {
      return null;
    }

    if (!content || content.trim().length === 0) {
      return null;
    }

    if (!authorId || authorId.trim().length === 0) {
      return null;
    }

    const now = new Date();

    return new ForumPost(
      id,
      title.trim(),
      content.trim(),
      authorId,
      ageGroup ?? null,
      now,
      now,
    );
  }

  /**
   * Reconstrói a entidade a partir de dados persistidos.
   */
  static reconstitute(
    id: string,
    title: string,
    content: string,
    authorId: string,
    ageGroup: AgeGroup | null,
    createdAt: Date,
    updatedAt: Date,
  ): ForumPost {
    return new ForumPost(id, title, content, authorId, ageGroup, createdAt, updatedAt);
  }

  // Getters

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get authorId(): string {
    return this._authorId;
  }

  get ageGroup(): AgeGroup | null {
    return this._ageGroup;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de Domínio

  /**
   * Atualiza o título do post.
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
   * Atualiza o conteúdo do post.
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
   * Define a faixa etária do post.
   */
  setAgeGroup(ageGroup: AgeGroup): void {
    this._ageGroup = ageGroup;
    this._updatedAt = new Date();
  }

  /**
   * Remove a categorização por faixa etária.
   */
  clearAgeGroup(): void {
    this._ageGroup = null;
    this._updatedAt = new Date();
  }

  /**
   * Verifica se o post é categorizado por faixa etária.
   */
  hasAgeGroup(): boolean {
    return this._ageGroup !== null;
  }

  /**
   * Verifica se um usuário é o autor do post.
   * Útil para verificar permissões de edição.
   */
  isAuthoredBy(userId: string): boolean {
    return this._authorId === userId;
  }

  equals(other: ForumPost): boolean {
    return this._id === other._id;
  }

  toPersistence(): {
    id: string;
    title: string;
    content: string;
    authorId: string;
    ageGroup: AgeGroup | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      title: this._title,
      content: this._content,
      authorId: this._authorId,
      ageGroup: this._ageGroup,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}