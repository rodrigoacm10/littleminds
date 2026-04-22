import { Injectable, Inject } from '@nestjs/common';
import { MessageVersionRepository, MessageRepository, MESSAGE_VERSION_REPOSITORY, MESSAGE_REPOSITORY } from '../../../domain';

/**
 * FindMessageHistoryUseCase
 *
 * Caso de uso para listar o histórico de versões de uma mensagem.
 * Útil para exibir histórico de edições.
 */
@Injectable()
export class FindMessageHistoryUseCase {
  constructor(
    @Inject(MESSAGE_VERSION_REPOSITORY)
    private readonly messageVersionRepository: MessageVersionRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(input: FindMessageHistoryInput): Promise<FindMessageHistoryOutput> {
    const message = await this.messageRepository.findById(input.messageId);

    if (!message) {
      return {
        success: false,
        error: 'MESSAGE_NOT_FOUND',
      };
    }

    const versions = await this.messageVersionRepository.findByMessageId(input.messageId);

    return {
      success: true,
      versions: versions
        .map((version) => ({
          id: version.id,
          messageId: version.messageId,
          content: version.content,
          editedBy: version.editedBy,
          createdAt: version.createdAt,
        }))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    };
  }
}

export interface FindMessageHistoryInput {
  messageId: string;
}

export interface FindMessageHistoryOutput {
  success: boolean;
  error?: 'MESSAGE_NOT_FOUND';
  versions?: Array<{
    id: string;
    messageId: string;
    content: string;
    editedBy: string;
    createdAt: Date;
  }>;
}