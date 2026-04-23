import { Injectable, Inject } from '@nestjs/common';
import { ArticleRepository, UserRepository, ARTICLE_REPOSITORY, USER_REPOSITORY } from '../../../domain';

/**
 * PublishArticleUseCase
 *
 * Caso de uso para publicar um artigo.
 *
 * Regras de negócio:
 * - Artigo deve existir
 * - Apenas o autor pode publicar
 * - Artigo deve ser um rascunho
 */
@Injectable()
export class PublishArticleUseCase {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: PublishArticleInput): Promise<PublishArticleOutput> {
    const article = await this.articleRepository.findById(input.id);

    if (!article) {
      return {
        success: false,
        error: 'ARTICLE_NOT_FOUND',
      };
    }

    const author = await this.userRepository.findById(article.authorId);
    if (!author || !author.canPublishArticles()) {
      return {
        success: false,
        error: 'NOT_AUTHORIZED',
      };
    }

    if (!article.isAuthoredBy(input.requesterId)) {
      return {
        success: false,
        error: 'NOT_AUTHORIZED',
      };
    }

    if (article.isPublished) {
      return {
        success: false,
        error: 'ALREADY_PUBLISHED',
      };
    }

    article.publish();
    await this.articleRepository.save(article);

    return {
      success: true,
      article: {
        id: article.id,
        title: article.title,
        isPublished: article.isPublished,
        publishedAt: article.updatedAt,
      },
    };
  }
}

export interface PublishArticleInput {
  id: string;
  requesterId: string;
}

export interface PublishArticleOutput {
  success: boolean;
  error?: 'ARTICLE_NOT_FOUND' | 'NOT_AUTHORIZED' | 'ALREADY_PUBLISHED';
  article?: {
    id: string;
    title: string;
    isPublished: boolean;
    publishedAt: Date;
  };
}