import { Injectable } from '@nestjs/common';
import { ForumPostRepository } from '../../../domain';

/**
 * FindForumPostByIdUseCase
 *
 * Caso de uso para buscar um post do fórum pelo ID.
 */
@Injectable()
export class FindForumPostByIdUseCase {
  constructor(private readonly forumPostRepository: ForumPostRepository) {}

  async execute(input: FindForumPostByIdInput): Promise<FindForumPostByIdOutput> {
    const post = await this.forumPostRepository.findById(input.id);

    if (!post) {
      return {
        success: false,
        error: 'POST_NOT_FOUND',
      };
    }

    return {
      success: true,
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        ageGroup: post.ageGroup,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    };
  }
}

export interface FindForumPostByIdInput {
  id: string;
}

export interface FindForumPostByIdOutput {
  success: boolean;
  error?: 'POST_NOT_FOUND';
  post?: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    ageGroup: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}