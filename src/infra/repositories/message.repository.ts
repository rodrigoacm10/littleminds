import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma';
import { MessageRepository, Message } from '../../domain';
import { MessageRole } from '../../domain/enums/message-role.enum';

/**
 * MessageRepositoryImpl
 *
 * Implementação do MessageRepository usando Prisma.
 */
@Injectable()
export class MessageRepositoryImpl implements MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(message: Message): Promise<void> {
    const data = message.toPersistence();

    await this.prisma.message.upsert({
      where: { id: data.id },
      update: {
        isDeleted: data.isDeleted,
      },
      create: {
        id: data.id,
        conversationId: data.conversationId,
        role: data.role,
        isDeleted: data.isDeleted,
      },
    });
  }

  async findById(id: string): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return null;
    }

    return Message.reconstitute(
      message.id,
      message.conversationId,
      message.role as MessageRole,
      message.isDeleted,
      message.createdAt,
    );
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((message) =>
      Message.reconstitute(
        message.id,
        message.conversationId,
        message.role as MessageRole,
        message.isDeleted,
        message.createdAt,
      ),
    );
  }

  async findByConversationIdAndRole(
    conversationId: string,
    role: MessageRole,
  ): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        role,
        isDeleted: false,
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((message) =>
      Message.reconstitute(
        message.id,
        message.conversationId,
        message.role as MessageRole,
        message.isDeleted,
        message.createdAt,
      ),
    );
  }

  async findLastByConversationId(conversationId: string): Promise<Message | null> {
    const message = await this.prisma.message.findFirst({
      where: {
        conversationId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!message) {
      return null;
    }

    return Message.reconstitute(
      message.id,
      message.conversationId,
      message.role as MessageRole,
      message.isDeleted,
      message.createdAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.message.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.message.count({
      where: { id },
    });

    return count > 0;
  }
}