import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma';
import { PostSupportRepository, PostSupport } from '../../domain';

/**
 * PostSupportRepositoryImpl
 *
 * Implementação do PostSupportRepository usando Prisma.
 */
@Injectable()
export class PostSupportRepositoryImpl implements PostSupportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(support: PostSupport): Promise<void> {
    const data = support.toPersistence();

    await this.prisma.postSupport.create({
      data: {
        id: data.id,
        userId: data.userId,
        postId: data.postId,
        createdAt: data.createdAt,
      },
    });
  }

  async findByUserAndPost(
    userId: string,
    postId: string,
  ): Promise<PostSupport | null> {
    const support = await this.prisma.postSupport.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (!support) {
      return null;
    }

    return PostSupport.reconstitute(
      support.id,
      support.userId,
      support.postId,
      support.createdAt,
    );
  }

  async findByPostId(postId: string): Promise<PostSupport[]> {
    const supports = await this.prisma.postSupport.findMany({
      where: { postId },
    });

    return supports.map((support) =>
      PostSupport.reconstitute(
        support.id,
        support.userId,
        support.postId,
        support.createdAt,
      ),
    );
  }

  async countByPostId(postId: string): Promise<number> {
    return this.prisma.postSupport.count({
      where: { postId },
    });
  }

  async existsByUserAndPost(userId: string, postId: string): Promise<boolean> {
    const count = await this.prisma.postSupport.count({
      where: {
        userId,
        postId,
      },
    });

    return count > 0;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.postSupport.delete({
      where: { id },
    });
  }
}