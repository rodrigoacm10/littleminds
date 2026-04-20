import { AgeGroup } from '../enums/age-group.enum';

/**
 * Article Entity
 *
 * Representa um artigo publicado por especialistas.
 * Conteúdo aprofundado sobre desenvolvimento infantil.
 *
 * Contexto de negócio:
 * - Apenas especialistas e admins podem criar artigos
 * - Artigos podem ser rascunhos (isPublished = false) ou publicados
 * - Categorizados por faixa etária opcionalmente
 *
 * Invariantes protegidas:
 * - Título e conteúdo obrigatórios
 * - Autor obrigatório (apenas especialistas podem publicar)
 * - isPublished controla visibilidade pública
 */
export class Article {
  private readonly _id: string;
  private _title: string;
  private _summary: string | null;
  private _content: string;
  private _coverImage: string | null;
  private _isPublished: boolean;
  private _ageGroup: AgeGroup | null;
  private readonly _authorId: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    title: string,
    summary: string | null,
    content: string,
    coverImage: string | null,
    isPublished: boolean,
    ageGroup: AgeGroup | null,
    authorId: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._title = title;
    this._summary = summary;
    this._content = content;
    this._coverImage = coverImage;
    this._isPublished = isPublished;
    this._ageGroup = ageGroup;
    this._authorId = authorId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method para criar um novo artigo.
   * Por padrão, artigos são criados como rascunhos (não publicados).
   */
  static create(
    id: string,
    title: string,
    content: string,
    authorId: string,
    summary?: string,
    coverImage?: string,
    ageGroup?: AgeGroup,
  ): Article | null {
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

    return new Article(
      id,
      title.trim(),
      summary?.trim() ?? null,
      content.trim(),
      coverImage?.trim() ?? null,
      false, // Sempre começa como rascunho
      ageGroup ?? null,
      authorId,
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
    summary: string | null,
    content: string,
    coverImage: string | null,
    isPublished: boolean,
    ageGroup: AgeGroup | null,
    authorId: string,
    createdAt: Date,
    updatedAt: Date,
  ): Article {
    return new Article(
      id,
      title,
      summary,
      content,
      coverImage,
      isPublished,
      ageGroup,
      authorId,
      createdAt,
      updatedAt,
    );
  }

  // Getters

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get summary(): string | null {
    return this._summary;
  }

  get content(): string {
    return this._content;
  }

  get coverImage(): string | null {
    return this._coverImage;
  }

  get isPublished(): boolean {
    return this._isPublished;
  }

  get ageGroup(): AgeGroup | null {
    return this._ageGroup;
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
   * Atualiza o título do artigo.
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
   * Atualiza o resumo do artigo.
   */
  updateSummary(newSummary: string | null): void {
    this._summary = newSummary?.trim() ?? null;
    this._updatedAt = new Date();
  }

  /**
   * Atualiza o conteúdo do artigo.
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
   * Atualiza a imagem de capa.
   */
  updateCoverImage(newCoverImage: string | null): void {
    this._coverImage = newCoverImage?.trim() ?? null;
    this._updatedAt = new Date();
  }

  /**
   * Define a faixa etária do artigo.
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
   * Publica o artigo.
   * Após publicado, o artigo fica visível para todos os usuários.
   */
  publish(): void {
    this._isPublished = true;
    this._updatedAt = new Date();
  }

  /**
   * Despublica o artigo (volta para rascunho).
   * Apenas remove da visualização pública, não deleta.
   */
  unpublish(): void {
    this._isPublished = false;
    this._updatedAt = new Date();
  }

  /**
   * Verifica se o artigo está publicado.
   */
  isPublishedStatus(): boolean {
    return this._isPublished;
  }

  /**
   * Verifica se o artigo é um rascunho.
   */
  isDraft(): boolean {
    return !this._isPublished;
  }

  /**
   * Verifica se um usuário é o autor do artigo.
   */
  isAuthoredBy(userId: string): boolean {
    return this._authorId === userId;
  }

  equals(other: Article): boolean {
    return this._id === other._id;
  }

  toPersistence(): {
    id: string;
    title: string;
    summary: string | null;
    content: string;
    coverImage: string | null;
    isPublished: boolean;
    ageGroup: AgeGroup | null;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      title: this._title,
      summary: this._summary,
      content: this._content,
      coverImage: this._coverImage,
      isPublished: this._isPublished,
      ageGroup: this._ageGroup,
      authorId: this._authorId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}