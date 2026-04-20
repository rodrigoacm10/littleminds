import { Article } from '../entities/article.entity';
import { AgeGroup } from '../enums/age-group.enum';

/**
 * ArticleRepository Interface
 *
 * Define o contrato para persistência de artigos.
 * Artigos são criados por especialistas.
 */
export interface ArticleRepository {
  /**
   * Salva um artigo (cria ou atualiza).
   */
  save(article: Article): Promise<void>;

  /**
   * Busca um artigo pelo ID.
   */
  findById(id: string): Promise<Article | null>;

  /**
   * Lista todos os artigos.
   */
  findAll(): Promise<Article[]>;

  /**
   * Lista artigos publicados.
   */
  findPublished(): Promise<Article[]>;

  /**
   * Lista rascunhos de um autor.
   */
  findDraftsByAuthor(authorId: string): Promise<Article[]>;

  /**
   * Lista artigos por autor.
   */
  findByAuthorId(authorId: string): Promise<Article[]>;

  /**
   * Lista artigos por faixa etária.
   */
  findByAgeGroup(ageGroup: AgeGroup): Promise<Article[]>;

  /**
   * Lista artigos publicados por faixa etária.
   */
  findPublishedByAgeGroup(ageGroup: AgeGroup): Promise<Article[]>;

  /**
   * Remove um artigo.
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se um artigo existe.
   */
  existsById(id: string): Promise<boolean>;
}