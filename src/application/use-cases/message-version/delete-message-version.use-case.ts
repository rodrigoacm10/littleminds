import { Injectable, Inject } from '@nestjs/common';
import { MessageVersionRepository, MESSAGE_VERSION_REPOSITORY } from '../../../domain';

/**
 * DeleteMessageVersionUseCase
 *
 * Caso de uso para deletar uma versão de mensagem.
 *
 * Regras de negócio:
 * - Versão deve existir
 * - Não deletar a última versão (poderia perder o conteúdo)
 */
@Injectable()
export class DeleteMessageVersionUseCase {
  constructor(
    @Inject(MESSAGE_VERSION_REPOSITORY)
    private readonly messageVersionRepository: MessageVersionRepository,
  ) {}

  async execute(input: DeleteMessageVersionInput): Promise<DeleteMessageVersionOutput> {
    const version = await this.messageVersionRepository.findById(input.id);
    if (!version) {
      return {
        success: false,
        error: 'VERSION_NOT_FOUND',
      };
    }

    // Verificar se não é a única versão
    const allVersions = await this.messageVersionRepository.findByMessageId(version.messageId);
    if (allVersions.length <= 1) {
      return {
        success: false,
        error: 'CANNOT_DELETE_ONLY_VERSION',
      };
    }

    await this.messageVersionRepository.delete(input.id);

    return {
      success: true,
    };
  }
}

export interface DeleteMessageVersionInput {
  id: string;
}

export interface DeleteMessageVersionOutput {
  success: boolean;
  error?: 'VERSION_NOT_FOUND' | 'CANNOT_DELETE_ONLY_VERSION';
}
