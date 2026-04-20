import { Injectable } from '@nestjs/common';
import { PostSupport, PostSupportRepository, ForumPostRepository, UserRepository } from '../../../domain';

/**
 * CreatePostSupportUseCase
 *
 * Caso de uso para dar "abraço virtual" a um post.
 *
 * Regras de negócio:
 * - Usuário deve existir
 * - Post deve existir
 * - Usuário não pode ter dado support anteriormente
 */
@Injectable()
export class CreatePostSupportUseCase {
  constructor(
    private readonly postSupportRepository: PostSupportRepository,
    private readonly forumPostRepository: ForumPostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreatePostSupportInput): Promise<CreatePostSupportOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      return {
        success: false,
        error: 'USER_NOT_FOUND',
      };
    }

    const post = await this.forumPostRepository.findById(input.postId);
    if (!post) {
      return {
        success: false,
        error: 'POST_NOT_FOUND',
      };
    }

    const alreadySupported = await this.postSupportRepository.existsByUserAndPost(
      input.userId,
      input.postId,
    );

    if (alreadySupported) {
      return {
        success: false,
        error: 'ALREADY_SUPPORTED',
      };
    }

    const support = PostSupport.create(
      crypto.randomUUID(),
      input.userId,
      input.postId,
    );

    if (!support) {
      return {
        success: false,
        error: 'INVALID_DATA',
      };
    }

    await this.postSupportRepository.save(support);

    return {
      success: true,
      support: {
        id: support.id,
        userId: support.userId,
        postId: support.postId,
        createdAt: support.createdAt,
      },
    };
  }
}

export interface CreatePostSupportInput {
  userId: string;
  postId: string;
}

export interface CreatePostSupportOutput {
  success: boolean;
  error?: 'USER_NOT_FOUND' | 'POST_NOT_FOUND' | 'ALREADY_SUPPORTED' | 'INVALID_DATA';
  support?: {
    id: string;
    userId: string;
    postId: string;
    createdAt: Date;
  };
}