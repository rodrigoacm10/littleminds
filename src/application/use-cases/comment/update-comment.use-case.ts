import { Injectable, Inject } from '@nestjs/common';
import { CommentRepository, COMMENT_REPOSITORY } from '../../../domain';

/**
 * UpdateCommentUseCase
 *
 * Caso de uso para atualizar um comentário.
 *
 * Regras de negócio:
 * - Comentário deve existir
 * - Apenas o autor pode atualizar
 */
@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(input: UpdateCommentInput): Promise<UpdateCommentOutput> {
    const comment = await this.commentRepository.findById(input.id);

    if (!comment) {
      return {
        success: false,
        error: 'COMMENT_NOT_FOUND',
      };
    }

    if (!comment.isAuthoredBy(input.requesterId)) {
      return {
        success: false,
        error: 'NOT_AUTHORIZED',
      };
    }

    comment.updateContent(input.content);

    await this.commentRepository.save(comment);

    return {
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        postId: comment.postId,
        authorId: comment.authorId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
    };
  }
}

export interface UpdateCommentInput {
  id: string;
  requesterId: string;
  content: string;
}

export interface UpdateCommentOutput {
  success: boolean;
  error?: 'COMMENT_NOT_FOUND' | 'NOT_AUTHORIZED';
  comment?: {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}