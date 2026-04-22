import { Injectable, Inject } from '@nestjs/common';
import { MessageVersionRepository, MessageRepository, MESSAGE_VERSION_REPOSITORY, MESSAGE_REPOSITORY } from '../../../domain';

/**
 * FindCurrentMessageContentUseCase
 *
 * Caso de uso para buscar o conteúdo atual de uma mensagem (última versão).
 */
@Injectable()
export class FindCurrentMessageContentUseCase {
  constructor(
    @Inject(MESSAGE_VERSION_REPOSITORY)
    private readonly messageVersionRepository: MessageVersionRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(input: FindCurrentMessageContentInput): Promise<FindCurrentMessageContentOutput> {
    const message = await this.messageRepository.findById(input.messageId);

    if (!message) {
      return {
        success: false,
        error: 'MESSAGE_NOT_FOUND',
      };
    }

    const currentVersion = await this.messageVersionRepository.findLatestByMessageId(input.messageId);

    if (!currentVersion) {
      return {
        success: false,
        error: 'NO_VERSIONS_FOUND',
      };
    }

    return {
      success: true,
      content: currentVersion.content,
      version: {
        id: currentVersion.id,
        messageId: currentVersion.messageId,
        content: currentVersion.content,
        editedBy: currentVersion.editedBy,
        createdAt: currentVersion.createdAt,
      },
    };
  }
}

export interface FindCurrentMessageContentInput {
  messageId: string;
}

export interface FindCurrentMessageContentOutput {
  success: boolean;
  error?: 'MESSAGE_NOT_FOUND' | 'NO_VERSIONS_FOUND';
  content?: string;
  version?: {
    id: string;
    messageId: string;
    content: string;
    editedBy: string;
    createdAt: Date;
  };
}