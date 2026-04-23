import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma';
import { CommentRepository, Comment } from '../../domain';

/**
 * CommentRepositoryImpl
 *
 * Implementação do CommentRepository usando Prisma.
 */
@Injectable()
export class CommentRepositoryImpl implements CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(comment: Comment): Promise<void> {
    const data = comment.toPersistence();

    await this.prisma.comment.upsert({
      where: { id: data.id },
      update: {
        content: data.content,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        content: data.content,
        postId: data.postId,
        authorId: data.authorId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return null;
    }

    return Comment.reconstitute(
      comment.id,
      comment.content,
      comment.postId,
      comment.authorId,
      comment.createdAt,
      comment.updatedAt,
    );
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });

    return comments.map((comment) =>
      Comment.reconstitute(
        comment.id,
        comment.content,
        comment.postId,
        comment.authorId,
        comment.createdAt,
        comment.updatedAt,
      ),
    );
  }

  async findByAuthorId(authorId: string): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });

    return comments.map((comment) =>
      Comment.reconstitute(
        comment.id,
        comment.content,
        comment.postId,
        comment.authorId,
        comment.createdAt,
        comment.updatedAt,
      ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.comment.count({
      where: { id },
    });

    return count > 0;
  }
}
