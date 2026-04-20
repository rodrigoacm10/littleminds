import { PostSupport } from '../entities/post-support.entity';

/**
 * PostSupportRepository Interface
 *
 * Define o contrato para persistência de apoios/likes em posts.
 * Entidade de relacionamento entre User e ForumPost.
 */
export interface PostSupportRepository {
  /**
   * Salva um apoio (cria).
   */
  save(support: PostSupport): Promise<void>;

  /**
   * Busca um apoio específico por usuário e post.
   */
  findByUserAndPost(userId: string, postId: string): Promise<PostSupport | null>;

  /**
   * Lista todos os apoios de um post.
   */
  findByPostId(postId: string): Promise<PostSupport[]>;

  /**
   * Conta quantos apoios um post recebeu.
   */
  countByPostId(postId: string): Promise<number>;

  /**
   * Verifica se um usuário já apoiou um post.
   */
  existsByUserAndPost(userId: string, postId: string): Promise<boolean>;

  /**
   * Remove um apoio.
   */
  delete(id: string): Promise<void>;
}