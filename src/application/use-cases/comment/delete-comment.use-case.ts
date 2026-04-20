import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../../domain';

/**
 * DeleteCommentUseCase
 *
 * Caso de uso para remover um comentário.
 *
 * Regras de negócio:
 * - Comentário deve existir
 * - Apenas o autor pode remover
 */
@Injectable()
export class DeleteCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(input: DeleteCommentInput): Promise<DeleteCommentOutput> {
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

    await this.commentRepository.delete(input.id);

    return {
      success: true,
    };
  }
}

export interface DeleteCommentInput {
  id: string;
  requesterId: string;
}

export interface DeleteCommentOutput {
  success: boolean;
  error?: 'COMMENT_NOT_FOUND' | 'NOT_AUTHORIZED';
}