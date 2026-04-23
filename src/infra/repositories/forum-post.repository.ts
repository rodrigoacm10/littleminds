import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma';
import {
  ForumPostRepository,
  ForumPost,
} from '../../domain';
import { AgeGroup } from '../../domain/enums/age-group.enum';

/**
 * ForumPostRepositoryImpl
 *
 * Implementação do ForumPostRepository usando Prisma.
 */
@Injectable()
export class ForumPostRepositoryImpl implements ForumPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(post: ForumPost): Promise<void> {
    const data = post.toPersistence();

    await this.prisma.forumPost.upsert({
      where: { id: data.id },
      update: {
        title: data.title,
        content: data.content,
        ageGroup: data.ageGroup,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        ageGroup: data.ageGroup,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<ForumPost | null> {
    const post = await this.prisma.forumPost.findUnique({
      where: { id },
    });

    if (!post) {
      return null;
    }

    return ForumPost.reconstitute(
      post.id,
      post.title,
      post.content,
      post.authorId,
      post.ageGroup as AgeGroup | null,
      post.createdAt,
      post.updatedAt,
    );
  }

  async findAll(): Promise<ForumPost[]> {
    const posts = await this.prisma.forumPost.findMany();

    return posts.map((post) =>
      ForumPost.reconstitute(
        post.id,
        post.title,
        post.content,
        post.authorId,
        post.ageGroup as AgeGroup | null,
        post.createdAt,
        post.updatedAt,
      ),
    );
  }

  async findByAuthorId(authorId: string): Promise<ForumPost[]> {
    const posts = await this.prisma.forumPost.findMany({
      where: { authorId },
    });

    return posts.map((post) =>
      ForumPost.reconstitute(
        post.id,
        post.title,
        post.content,
        post.authorId,
        post.ageGroup as AgeGroup | null,
        post.createdAt,
        post.updatedAt,
      ),
    );
  }

  async findByAgeGroup(ageGroup: AgeGroup): Promise<ForumPost[]> {
    const posts = await this.prisma.forumPost.findMany({
      where: { ageGroup },
    });

    return posts.map((post) =>
      ForumPost.reconstitute(
        post.id,
        post.title,
        post.content,
        post.authorId,
        post.ageGroup as AgeGroup | null,
        post.createdAt,
        post.updatedAt,
      ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.forumPost.delete({
      where: { id },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.forumPost.count({
      where: { id },
    });

    return count > 0;
  }
}