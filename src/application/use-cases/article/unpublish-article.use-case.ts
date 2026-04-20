import { Injectable } from '@nestjs/common';
import { ArticleRepository } from '../../../domain';

/**
 * UnpublishArticleUseCase
 *
 * Caso de uso para despublicar um artigo (voltar para rascunho).
 *
 * Regras de negócio:
 * - Artigo deve existir
 * - Apenas o autor pode despublicar
 * - Artigo deve estar publicado
 */
@Injectable()
export class UnpublishArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: UnpublishArticleInput): Promise<UnpublishArticleOutput> {
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

    if (!article.isPublished) {
      return {
        success: false,
        error: 'NOT_PUBLISHED',
      };
    }

    article.unpublish();
    await this.articleRepository.save(article);

    return {
      success: true,
    };
  }
}

export interface UnpublishArticleInput {
  id: string;
  requesterId: string;
}

export interface UnpublishArticleOutput {
  success: boolean;
  error?: 'ARTICLE_NOT_FOUND' | 'NOT_AUTHORIZED' | 'NOT_PUBLISHED';
}