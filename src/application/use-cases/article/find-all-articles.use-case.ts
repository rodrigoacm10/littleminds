import { Injectable, Inject } from '@nestjs/common';
import { ArticleRepository, AgeGroup, ARTICLE_REPOSITORY } from '../../../domain';

/**
 * FindAllArticlesUseCase
 *
 * Caso de uso para listar artigos.
 * Opcionalmente filtra por publicados, autor ou faixa etária.
 */
@Injectable()
export class FindAllArticlesUseCase {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(input?: FindAllArticlesInput): Promise<FindAllArticlesOutput> {
    let articles;

    if (input?.publishedOnly) {
      articles = await this.articleRepository.findPublished();
    } else if (input?.authorId) {
      if (input.draftsOnly) {
        articles = await this.articleRepository.findDraftsByAuthor(input.authorId);
      } else {
        articles = await this.articleRepository.findByAuthorId(input.authorId);
      }
    } else if (input?.ageGroup && input.publishedOnly) {
      articles = await this.articleRepository.findPublishedByAgeGroup(input.ageGroup);
    } else if (input?.ageGroup) {
      articles = await this.articleRepository.findByAgeGroup(input.ageGroup);
    } else {
      articles = await this.articleRepository.findAll();
    }

    return {
      success: true,
      articles: articles.map((article) => ({
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
      })),
    };
  }
}

export interface FindAllArticlesInput {
  publishedOnly?: boolean;
  draftsOnly?: boolean;
  authorId?: string;
  ageGroup?: AgeGroup;
}

export interface FindAllArticlesOutput {
  success: boolean;
  articles: Array<{
    id: string;
    title: string;
    summary: string | null;
    content: string;
    coverImage: string | null;
    isPublished: boolean;
    ageGroup: AgeGroup | null;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}