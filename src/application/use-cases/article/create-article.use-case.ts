import { Injectable } from '@nestjs/common';
import { Article, ArticleRepository, UserRepository, AgeGroup } from '../../../domain';

/**
 * CreateArticleUseCase
 *
 * Caso de uso para criar um novo artigo.
 *
 * Regras de negócio:
 * - Autor deve existir
 * - Autor deve ser especialista ou admin
 * - Artigo é criado como rascunho por padrão
 */
@Injectable()
export class CreateArticleUseCase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateArticleInput): Promise<CreateArticleOutput> {
    const author = await this.userRepository.findById(input.authorId);
    if (!author) {
      return {
        success: false,
        error: 'AUTHOR_NOT_FOUND',
      };
    }

    if (!author.canPublishArticles()) {
      return {
        success: false,
        error: 'NOT_AUTHORIZED',
      };
    }

    const article = Article.create(
      crypto.randomUUID(),
      input.title,
      input.content,
      input.authorId,
      input.summary,
      input.coverImage,
      input.ageGroup,
    );

    if (!article) {
      return {
        success: false,
        error: 'INVALID_DATA',
      };
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
      },
    };
  }
}

export interface CreateArticleInput {
  title: string;
  content: string;
  authorId: string;
  summary?: string;
  coverImage?: string;
  ageGroup?: AgeGroup;
}

export interface CreateArticleOutput {
  success: boolean;
  error?: 'AUTHOR_NOT_FOUND' | 'NOT_AUTHORIZED' | 'INVALID_DATA';
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
  };
}