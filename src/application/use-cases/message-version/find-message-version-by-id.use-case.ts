import { Injectable, Inject } from '@nestjs/common';
import { MessageVersionRepository, MESSAGE_VERSION_REPOSITORY } from '../../../domain';

/**
 * FindMessageVersionByIdUseCase
 *
 * Caso de uso para buscar uma versão de mensagem pelo ID.
 */
@Injectable()
export class FindMessageVersionByIdUseCase {
  constructor(
    @Inject(MESSAGE_VERSION_REPOSITORY)
    private readonly messageVersionRepository: MessageVersionRepository,
  ) {}

  async execute(input: FindMessageVersionByIdInput): Promise<FindMessageVersionByIdOutput> {
    const version = await this.messageVersionRepository.findById(input.id);

    if (!version) {
      return {
        success: false,
        error: 'VERSION_NOT_FOUND',
      };
    }

    return {
      success: true,
      version: {
        id: version.id,
        messageId: version.messageId,
        content: version.content,
        editedBy: version.editedBy,
        createdAt: version.createdAt,
      },
    };
  }
}

export interface FindMessageVersionByIdInput {
  id: string;
}

export interface FindMessageVersionByIdOutput {
  success: boolean;
  error?: 'VERSION_NOT_FOUND';
  version?: {
    id: string;
    messageId: string;
    content: string;
    editedBy: string;
    createdAt: Date;
  };
}