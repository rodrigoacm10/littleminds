import { Injectable } from '@nestjs/common';
import { PostSupportRepository } from '../../../domain';

/**
 * FindPostSupportsByPostUseCase
 *
 * Caso de uso para listar todos os apoios de um post.
 */
@Injectable()
export class FindPostSupportsByPostUseCase {
  constructor(private readonly postSupportRepository: PostSupportRepository) {}

  async execute(input: FindPostSupportsByPostInput): Promise<FindPostSupportsByPostOutput> {
    const supports = await this.postSupportRepository.findByPostId(input.postId);

    return {
      success: true,
      supports: supports.map((support) => ({
        id: support.id,
        userId: support.userId,
        postId: support.postId,
        createdAt: support.createdAt,
      })),
      total: supports.length,
    };
  }
}

export interface FindPostSupportsByPostInput {
  postId: string;
}

export interface FindPostSupportsByPostOutput {
  success: boolean;
  supports: Array<{
    id: string;
    userId: string;
    postId: string;
    createdAt: Date;
  }>;
  total: number;
}