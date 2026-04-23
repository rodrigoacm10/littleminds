import { Injectable, Inject } from '@nestjs/common';
import { Comment, CommentRepository, ForumPostRepository, UserRepository, COMMENT_REPOSITORY, FORUM_POST_REPOSITORY, USER_REPOSITORY } from '../../../domain';

/**
 * CreateCommentUseCase
 *
 * Caso de uso para criar um comentário em um post.
 *
 * Regras de negócio:
 * - Post deve existir
 * - Autor deve existir
 * - Conteúdo obrigatório
 */
@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    @Inject(FORUM_POST_REPOSITORY)
    private readonly forumPostRepository: ForumPostRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateCommentInput): Promise<CreateCommentOutput> {
    const post = await this.forumPostRepository.findById(input.postId);
    if (!post) {
      return {
        success: false,
        error: 'POST_NOT_FOUND',
      };
    }

    const author = await this.userRepository.findById(input.authorId);
    if (!author) {
      return {
        success: false,
        error: 'AUTHOR_NOT_FOUND',
      };
    }

    const comment = Comment.create(
      crypto.randomUUID(),
      input.content,
      input.postId,
      input.authorId,
    );

    if (!comment) {
      return {
        success: false,
        error: 'INVALID_DATA',
      };
    }

    await this.commentRepository.save(comment);

    return {
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        postId: comment.postId,
        authorId: comment.authorId,
        createdAt: comment.createdAt,
      },
    };
  }
}

export interface CreateCommentInput {
  content: string;
  postId: string;
  authorId: string;
}

export interface CreateCommentOutput {
  success: boolean;
  error?: 'POST_NOT_FOUND' | 'AUTHOR_NOT_FOUND' | 'INVALID_DATA';
  comment?: {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: Date;
  };
}