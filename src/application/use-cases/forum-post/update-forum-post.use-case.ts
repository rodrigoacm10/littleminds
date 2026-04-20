import { Injectable } from '@nestjs/common';
import { ForumPostRepository, AgeGroup } from '../../../domain';

/**
 * UpdateForumPostUseCase
 *
 * Caso de uso para atualizar um post do fórum.
 *
 * Regras de negócio:
 * - Post deve existir
 * - Apenas o autor pode atualizar (verificação via input)
 */
@Injectable()
export class UpdateForumPostUseCase {
  constructor(private readonly forumPostRepository: ForumPostRepository) {}

  async execute(input: UpdateForumPostInput): Promise<UpdateForumPostOutput> {
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

    if (input.title) {
      post.updateTitle(input.title);
    }

    if (input.content) {
      post.updateContent(input.content);
    }

    if (input.ageGroup !== undefined) {
      if (input.ageGroup === null) {
        post.clearAgeGroup();
      } else {
        post.setAgeGroup(input.ageGroup);
      }
    }

    await this.forumPostRepository.save(post);

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

export interface UpdateForumPostInput {
  id: string;
  requesterId: string;
  title?: string;
  content?: string;
  ageGroup?: AgeGroup | null;
}

export interface UpdateForumPostOutput {
  success: boolean;
  error?: 'POST_NOT_FOUND' | 'NOT_AUTHORIZED';
  post?: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    ageGroup: AgeGroup | null;
    createdAt: Date;
    updatedAt: Date;
  };
}