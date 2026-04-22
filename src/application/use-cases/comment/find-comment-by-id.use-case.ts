import { Injectable, Inject } from '@nestjs/common';
import { CommentRepository, COMMENT_REPOSITORY } from '../../../domain';

/**
 * FindCommentByIdUseCase
 *
 * Caso de uso para buscar um comentário pelo ID.
 */
@Injectable()
export class FindCommentByIdUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(input: FindCommentByIdInput): Promise<FindCommentByIdOutput> {
    const comment = await this.commentRepository.findById(input.id);

    if (!comment) {
      return {
        success: false,
        error: 'COMMENT_NOT_FOUND',
      };
    }

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

export interface FindCommentByIdInput {
  id: string;
}

export interface FindCommentByIdOutput {
  success: boolean;
  error?: 'COMMENT_NOT_FOUND';
  comment?: {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}