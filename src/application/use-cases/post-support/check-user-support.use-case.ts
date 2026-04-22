import { Injectable, Inject } from '@nestjs/common';
import { PostSupportRepository, POST_SUPPORT_REPOSITORY } from '../../../domain';

/**
 * CheckUserSupportUseCase
 *
 * Caso de uso para verificar se um usuário apoiou um post.
 */
@Injectable()
export class CheckUserSupportUseCase {
  constructor(
    @Inject(POST_SUPPORT_REPOSITORY)
    private readonly postSupportRepository: PostSupportRepository,
  ) {}

  async execute(input: CheckUserSupportInput): Promise<CheckUserSupportOutput> {
    const hasSupported = await this.postSupportRepository.existsByUserAndPost(
      input.userId,
      input.postId,
    );

    const count = await this.postSupportRepository.countByPostId(input.postId);

    return {
      success: true,
      hasSupported,
      totalSupports: count,
    };
  }
}

export interface CheckUserSupportInput {
  userId: string;
  postId: string;
}

export interface CheckUserSupportOutput {
  success: boolean;
  hasSupported: boolean;
  totalSupports: number;
}