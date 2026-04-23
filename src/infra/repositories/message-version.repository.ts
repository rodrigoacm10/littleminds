import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma';
import { MessageVersionRepository, MessageVersion } from '../../domain';

/**
 * MessageVersionRepositoryImpl
 *
 * Implementação do MessageVersionRepository usando Prisma.
 */
@Injectable()
export class MessageVersionRepositoryImpl implements MessageVersionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(version: MessageVersion): Promise<void> {
    const data = version.toPersistence();

    await this.prisma.messageVersion.create({
      data: {
        id: data.id,
        messageId: data.messageId,
        content: data.content,
        editedBy: data.editedBy,
        createdAt: data.createdAt,
      },
    });
  }

  async findById(id: string): Promise<MessageVersion | null> {
    const version = await this.prisma.messageVersion.findUnique({
      where: { id },
    });

    if (!version) {
      return null;
    }

    return MessageVersion.reconstitute(
      version.id,
      version.messageId,
      version.content,
      version.editedBy,
      version.createdAt,
    );
  }

  async findByMessageId(messageId: string): Promise<MessageVersion[]> {
    const versions = await this.prisma.messageVersion.findMany({
      where: { messageId },
      orderBy: { createdAt: 'asc' },
    });

    return versions.map((version) =>
      MessageVersion.reconstitute(
        version.id,
        version.messageId,
        version.content,
        version.editedBy,
        version.createdAt,
      ),
    );
  }

  async findLatestByMessageId(messageId: string): Promise<MessageVersion | null> {
    const version = await this.prisma.messageVersion.findFirst({
      where: { messageId },
      orderBy: { createdAt: 'desc' },
    });

    if (!version) {
      return null;
    }

    return MessageVersion.reconstitute(
      version.id,
      version.messageId,
      version.content,
      version.editedBy,
      version.createdAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.messageVersion.delete({
      where: { id },
    });
  }
}