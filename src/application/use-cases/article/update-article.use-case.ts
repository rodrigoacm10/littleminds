import { Injectable } from '@nestjs/common';
import { ArticleRepository, AgeGroup } from '../../../domain';

/**
 * UpdateArticleUseCase
 *
 * Caso de uso para atualizar um artigo.
 *
 * Regras de negócio:
 * - Artigo deve existir
 * - Apenas o autor pode atualizar
 */
@Injectable()
export class UpdateArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: UpdateArticleInput): Promise<UpdateArticleOutput> {
    const article = await this.articleRepository.findById(input.id);

    if (!article) {
      return {
        success: false,
        error: 'ARTICLE_NOT_FOUND',
      };
    }

    if (!article.isAuthoredBy(input.requesterId)) {
      return {
        success: false,
        error: 'NOT_AUTHORIZED',
      };
    }

    if (input.title) {
      article.updateTitle(input.title);
    }

    if (input.content) {
      article.updateContent(input.content);
    }

    if (input.summary !== undefined) {
      article.updateSummary(input.summary);
    }

    if (input.coverImage !== undefined) {
      article.updateCoverImage(input.coverImage);
    }

    if (input.ageGroup !== undefined) {
      if (input.ageGroup === null) {
        article.clearAgeGroup();
      } else {
        article.setAgeGroup(input.ageGroup);
      }
    }

    await this.articleRepository.save(article);

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

export interface UpdateArticleInput {
  id: string;
  requesterId: string;
  title?: string;
  content?: string;
  summary?: string | null;
  coverImage?: string | null;
  ageGroup?: AgeGroup | null;
}

export interface UpdateArticleOutput {
  success: boolean;
  error?: 'ARTICLE_NOT_FOUND' | 'NOT_AUTHORIZED';
  article?: {
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
  };
}