import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma';
import { ConversationRepository, Conversation } from '../../domain';

/**
 * ConversationRepositoryImpl
 *
 * Implementação do ConversationRepository usando Prisma.
 */
@Injectable()
export class ConversationRepositoryImpl implements ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(conversation: Conversation): Promise<void> {
    const data = conversation.toPersistence();

    await this.prisma.conversation.upsert({
      where: { id: data.id },
      update: {
        title: data.title,
        isArchived: data.isArchived,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        userId: data.userId,
        title: data.title,
        isArchived: data.isArchived,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Conversation | null> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return null;
    }

    return Conversation.reconstitute(
      conversation.id,
      conversation.userId,
      conversation.title,
      conversation.isArchived,
      conversation.createdAt,
      conversation.updatedAt,
    );
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conversation) =>
      Conversation.reconstitute(
        conversation.id,
        conversation.userId,
        conversation.title,
        conversation.isArchived,
        conversation.createdAt,
        conversation.updatedAt,
      ),
    );
  }

  async findActiveByUserId(userId: string): Promise<Conversation[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        userId,
        isArchived: false,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conversation) =>
      Conversation.reconstitute(
        conversation.id,
        conversation.userId,
        conversation.title,
        conversation.isArchived,
        conversation.createdAt,
        conversation.updatedAt,
      ),
    );
  }

  async findArchivedByUserId(userId: string): Promise<Conversation[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        userId,
        isArchived: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conversation) =>
      Conversation.reconstitute(
        conversation.id,
        conversation.userId,
        conversation.title,
        conversation.isArchived,
        conversation.createdAt,
        conversation.updatedAt,
      ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.conversation.delete({
      where: { id },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.conversation.count({
      where: { id },
    });

    return count > 0;
  }
}
