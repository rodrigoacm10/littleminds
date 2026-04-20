import { Injectable } from '@nestjs/common';
import { ArticleRepository } from '../../../domain';

/**
 * DeleteArticleUseCase
 *
 * Caso de uso para remover um artigo.
 *
 * Regras de negócio:
 * - Artigo deve existir
 * - Apenas o autor pode remover
 */
@Injectable()
export class DeleteArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: DeleteArticleInput): Promise<DeleteArticleOutput> {
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

    await this.articleRepository.delete(input.id);

    return {
      success: true,
    };
  }
}

export interface DeleteArticleInput {
  id: string;
  requesterId: string;
}

export interface DeleteArticleOutput {
  success: boolean;
  error?: 'ARTICLE_NOT_FOUND' | 'NOT_AUTHORIZED';
}