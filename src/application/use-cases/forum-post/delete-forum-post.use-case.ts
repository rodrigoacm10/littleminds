import { Injectable, Inject } from '@nestjs/common';
import { ForumPostRepository, FORUM_POST_REPOSITORY } from '../../../domain';

/**
 * DeleteForumPostUseCase
 *
 * Caso de uso para remover um post do fórum.
 *
 * Regras de negócio:
 * - Post deve existir
 * - Apenas o autor pode remover
 */
@Injectable()
export class DeleteForumPostUseCase {
  constructor(
    @Inject(FORUM_POST_REPOSITORY)
    private readonly forumPostRepository: ForumPostRepository,
  ) {}

  async execute(input: DeleteForumPostInput): Promise<DeleteForumPostOutput> {
    const post = await this.forumPostRepository.findById(input.id);

    if (!post) {
      return {
        success: false,
        error: 'POST_NOT_FOUND',
      };
    }

    if (!post.isAuthoredBy(input.requesterId)) {
      return {
        success: false,
        error: 'NOT_AUTHORIZED',
      };
    }

    await this.forumPostRepository.delete(input.id);

    return {
      success: true,
    };
  }
}

export interface DeleteForumPostInput {
  id: string;
  requesterId: string;
}

export interface DeleteForumPostOutput {
  success: boolean;
  error?: 'POST_NOT_FOUND' | 'NOT_AUTHORIZED';
}