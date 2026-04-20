import { Injectable } from '@nestjs/common';
import { ForumPostRepository, AgeGroup } from '../../../domain';

/**
 * FindAllForumPostsUseCase
 *
 * Caso de uso para listar posts do fórum.
 * Opcionalmente filtra por faixa etária ou autor.
 */
@Injectable()
export class FindAllForumPostsUseCase {
  constructor(private readonly forumPostRepository: ForumPostRepository) {}

  async execute(input?: FindAllForumPostsInput): Promise<FindAllForumPostsOutput> {
    let posts;

    if (input?.authorId) {
      posts = await this.forumPostRepository.findByAuthorId(input.authorId);
    } else if (input?.ageGroup) {
      posts = await this.forumPostRepository.findByAgeGroup(input.ageGroup);
    } else {
      posts = await this.forumPostRepository.findAll();
    }

    return {
      success: true,
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        ageGroup: post.ageGroup,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
    };
  }
}

export interface FindAllForumPostsInput {
  authorId?: string;
  ageGroup?: AgeGroup;
}

export interface FindAllForumPostsOutput {
  success: boolean;
  posts: Array<{
    id: string;
    title: string;
    content: string;
    authorId: string;
    ageGroup: AgeGroup | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}