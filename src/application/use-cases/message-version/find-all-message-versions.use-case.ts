import { Injectable, Inject } from '@nestjs/common';
import { MessageVersionRepository, MESSAGE_VERSION_REPOSITORY } from '../../../domain';

/**
 * FindAllMessageVersionsUseCase
 *
 * Caso de uso para listar todas as versões de uma mensagem.
 *
 * Regras de negócio:
 * - Retorna versões ordenadas por data de criação
 */
@Injectable()
export class FindAllMessageVersionsUseCase {
  constructor(
    @Inject(MESSAGE_VERSION_REPOSITORY)
    private readonly messageVersionRepository: MessageVersionRepository,
  ) {}

  async execute(input: FindAllMessageVersionsInput): Promise<FindAllMessageVersionsOutput> {
    const versions = await this.messageVersionRepository.findByMessageId(input.messageId);

    if (versions.length === 0) {
      return {
        success: false,
        error: 'NO_VERSIONS_FOUND',
      };
    }

    return {
      success: true,
      versions: versions.map((v) => ({
        id: v.id,
        messageId: v.messageId,
        content: v.content,
        editedBy: v.editedBy,
        createdAt: v.createdAt,
      })),
    };
  }
}

export interface FindAllMessageVersionsInput {
  messageId: string;
}

export interface FindAllMessageVersionsOutput {
  success: boolean;
  error?: 'NO_VERSIONS_FOUND';
  versions?: Array<{
    id: string;
    messageId: string;
    content: string;
    editedBy: string;
    createdAt: Date;
  }>;
}
