import { Injectable } from '@nestjs/common';
import { MessageRepository, MessageVersionRepository } from '../../../domain';

/**
 * FindMessageByIdUseCase
 *
 * Caso de uso para buscar uma mensagem pelo ID.
 * Retorna também o conteúdo atual (última versão).
 */
@Injectable()
export class FindMessageByIdUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageVersionRepository: MessageVersionRepository,
  ) {}

  async execute(input: FindMessageByIdInput): Promise<FindMessageByIdOutput> {
    const message = await this.messageRepository.findById(input.id);

    if (!message) {
      return {
        success: false,
        error: 'MESSAGE_NOT_FOUND',
      };
    }

    const latestVersion = await this.messageVersionRepository.findLatestByMessageId(message.id);

    return {
      success: true,
      message: {
        id: message.id,
        conversationId: message.conversationId,
        role: message.role,
        content: latestVersion?.content ?? '',
        isDeleted: message.isDeleted,
        createdAt: message.createdAt,
      },
    };
  }
}

export interface FindMessageByIdInput {
  id: string;
}

export interface FindMessageByIdOutput {
  success: boolean;
  error?: 'MESSAGE_NOT_FOUND';
  message?: {
    id: string;
    conversationId: string;
    role: string;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
  };
}