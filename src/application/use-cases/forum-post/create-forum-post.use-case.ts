import { Injectable, Inject } from '@nestjs/common';
import { ForumPost, ForumPostRepository, UserRepository, AgeGroup, FORUM_POST_REPOSITORY, USER_REPOSITORY } from '../../../domain';

/**
 * CreateForumPostUseCase
 *
 * Caso de uso para criar um novo post no fórum.
 *
 * Regras de negócio:
 * - Autor deve existir
 * - Título e conteúdo obrigatórios
 * - AgeGroup opcional
 */
@Injectable()
export class CreateForumPostUseCase {
  constructor(
    @Inject(FORUM_POST_REPOSITORY)
    private readonly forumPostRepository: ForumPostRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateForumPostInput): Promise<CreateForumPostOutput> {
    const author = await this.userRepository.findById(input.authorId);
    if (!author) {
      return {
        success: false,
        error: 'AUTHOR_NOT_FOUND',
      };
    }

    const post = ForumPost.create(
      crypto.randomUUID(),
      input.title,
      input.content,
      input.authorId,
      input.ageGroup,
    );

    if (!post) {
      return {
        success: false,
        error: 'INVALID_DATA',
      };
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
      },
    };
  }
}

export interface CreateForumPostInput {
  title: string;
  content: string;
  authorId: string;
  ageGroup?: AgeGroup;
}

export interface CreateForumPostOutput {
  success: boolean;
  error?: 'AUTHOR_NOT_FOUND' | 'INVALID_DATA';
  post?: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    ageGroup: AgeGroup | null;
    createdAt: Date;
  };
}