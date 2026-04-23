import { Comment } from '../entities/comment.entity';

/**
 * CommentRepository Interface
 *
 * Define o contrato para persistência de comentários.
 * Entidade filha de ForumPost.
 */
export interface CommentRepository {
  /**
   * Salva um comentário (cria ou atualiza).
   */
  save(comment: Comment): Promise<void>;

  /**
   * Busca um comentário pelo ID.
   */
  findById(id: string): Promise<Comment | null>;

  /**
   * Lista comentários de um post.
   */
  findByPostId(postId: string): Promise<Comment[]>;

  /**
   * Lista comentários de um autor.
   */
  findByAuthorId(authorId: string): Promise<Comment[]>;

  /**
   * Remove um comentário.
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se um comentário existe.
   */
  existsById(id: string): Promise<boolean>;
}