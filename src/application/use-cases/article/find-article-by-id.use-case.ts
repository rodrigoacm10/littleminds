import { Injectable, Inject } from '@nestjs/common';
import { ArticleRepository, ARTICLE_REPOSITORY } from '../../../domain';

/**
 * FindArticleByIdUseCase
 *
 * Caso de uso para buscar um artigo pelo ID.
 */
@Injectable()
export class FindArticleByIdUseCase {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(input: FindArticleByIdInput): Promise<FindArticleByIdOutput> {
    const article = await this.articleRepository.findById(input.id);

    if (!article) {
      return {
        success: false,
        error: 'ARTICLE_NOT_FOUND',
      };
    }

    return {
      success: true,
      article: {
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content,
        coverImage: article.coverImage,
        isPublished: article.isPublished,
        ageGroup: article.ageGroup,
        authorId: article.authorId,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      },
    };
  }
}

export interface FindArticleByIdInput {
  id: string;
}

export interface FindArticleByIdOutput {
  success: boolean;
  error?: 'ARTICLE_NOT_FOUND';
  article?: {
    id: string;
    title: string;
    summary: string | null;
    content: string;
    coverImage: string | null;
    isPublished: boolean;
    ageGroup: string | null;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}