import { ForumPost } from '../entities/forum-post.entity';
import { AgeGroup } from '../enums/age-group.enum';

/**
 * ForumPostRepository Interface
 *
 * Define o contrato para persistência de posts do fórum.
 * Aggregate Root: ForumPost (contém Comments e PostSupports)
 *
 * Clean Architecture:
 * - Domain define a interface
 * - Infra implementa com Prisma
 */
export interface ForumPostRepository {
  /**
   * Salva um post (cria ou atualiza).
   */
  save(post: ForumPost): Promise<void>;

  /**
   * Busca um post pelo ID.
   */
  findById(id: string): Promise<ForumPost | null>;

  /**
   * Lista todos os posts.
   */
  findAll(): Promise<ForumPost[]>;

  /**
   * Lista posts por autor.
   */
  findByAuthorId(authorId: string): Promise<ForumPost[]>;

  /**
   * Lista posts por faixa etária.
   */
  findByAgeGroup(ageGroup: AgeGroup): Promise<ForumPost[]>;

  /**
   * Remove um post pelo ID.
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se um post existe.
   */
  existsById(id: string): Promise<boolean>;
}