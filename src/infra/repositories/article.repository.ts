import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma';
import { ArticleRepository, Article } from '../../domain';
import { AgeGroup } from '../../domain/enums/age-group.enum';

/**
 * ArticleRepositoryImpl
 *
 * Implementação do ArticleRepository usando Prisma.
 */
@Injectable()
export class ArticleRepositoryImpl implements ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(article: Article): Promise<void> {
    const data = article.toPersistence();

    await this.prisma.article.upsert({
      where: { id: data.id },
      update: {
        title: data.title,
        summary: data.summary,
        content: data.content,
        coverImage: data.coverImage,
        isPublished: data.isPublished,
        ageGroup: data.ageGroup,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        title: data.title,
        summary: data.summary,
        content: data.content,
        coverImage: data.coverImage,
        isPublished: data.isPublished,
        ageGroup: data.ageGroup,
        authorId: data.authorId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return null;
    }

    return Article.reconstitute(
      article.id,
      article.title,
      article.summary,
      article.content,
      article.coverImage,
      article.isPublished,
      article.ageGroup as AgeGroup | null,
      article.authorId,
      article.createdAt,
      article.updatedAt,
    );
  }

  async findAll(): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return articles.map((article) =>
      Article.reconstitute(
        article.id,
        article.title,
        article.summary,
        article.content,
        article.coverImage,
        article.isPublished,
        article.ageGroup as AgeGroup | null,
        article.authorId,
        article.createdAt,
        article.updatedAt,
      ),
    );
  }

  async findPublished(): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    return articles.map((article) =>
      Article.reconstitute(
        article.id,
        article.title,
        article.summary,
        article.content,
        article.coverImage,
        article.isPublished,
        article.ageGroup as AgeGroup | null,
        article.authorId,
        article.createdAt,
        article.updatedAt,
      ),
    );
  }

  async findDraftsByAuthor(authorId: string): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      where: {
        authorId,
        isPublished: false,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return articles.map((article) =>
      Article.reconstitute(
        article.id,
        article.title,
        article.summary,
        article.content,
        article.coverImage,
        article.isPublished,
        article.ageGroup as AgeGroup | null,
        article.authorId,
        article.createdAt,
        article.updatedAt,
      ),
    );
  }

  async findByAuthorId(authorId: string): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });

    return articles.map((article) =>
      Article.reconstitute(
        article.id,
        article.title,
        article.summary,
        article.content,
        article.coverImage,
        article.isPublished,
        article.ageGroup as AgeGroup | null,
        article.authorId,
        article.createdAt,
        article.updatedAt,
      ),
    );
  }

  async findByAgeGroup(ageGroup: AgeGroup): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      where: { ageGroup },
      orderBy: { createdAt: 'desc' },
    });

    return articles.map((article) =>
      Article.reconstitute(
        article.id,
        article.title,
        article.summary,
        article.content,
        article.coverImage,
        article.isPublished,
        article.ageGroup as AgeGroup | null,
        article.authorId,
        article.createdAt,
        article.updatedAt,
      ),
    );
  }

  async findPublishedByAgeGroup(ageGroup: AgeGroup): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      where: {
        ageGroup,
        isPublished: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return articles.map((article) =>
      Article.reconstitute(
        article.id,
        article.title,
        article.summary,
        article.content,
        article.coverImage,
        article.isPublished,
        article.ageGroup as AgeGroup | null,
        article.authorId,
        article.createdAt,
        article.updatedAt,
      ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.article.count({
      where: { id },
    });

    return count > 0;
  }
}
