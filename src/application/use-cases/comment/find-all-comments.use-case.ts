import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../../domain';

/**
 * FindAllCommentsUseCase
 *
 * Caso de uso para listar comentários.
 * Opcionalmente filtra por post ou autor.
 */
@Injectable()
export class FindAllCommentsUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(input?: FindAllCommentsInput): Promise<FindAllCommentsOutput> {
    let comments;

    if (input?.postId) {
      comments = await this.commentRepository.findByPostId(input.postId);
    } else if (input?.authorId) {
      comments = await this.commentRepository.findByAuthorId(input.authorId);
    } else {
      const allComments = await Promise.resolve([]);
      comments = allComments;
    }

    return {
      success: true,
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        postId: comment.postId,
        authorId: comment.authorId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })),
    };
  }
}

export interface FindAllCommentsInput {
  postId?: string;
  authorId?: string;
}

export interface FindAllCommentsOutput {
  success: boolean;
  comments: Array<{
    id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}