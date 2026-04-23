import { Injectable, Inject } from '@nestjs/common';
import { MessageRepository, MESSAGE_REPOSITORY } from '../../../domain';

/**
 * RestoreMessageUseCase
 *
 * Caso de uso para restaurar uma mensagem deletada.
 *
 * Regras de negócio:
 * - Mensagem deve existir
 * - Mensagem deve estar deletada
 */
@Injectable()
export class RestoreMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(input: RestoreMessageInput): Promise<RestoreMessageOutput> {
    const message = await this.messageRepository.findById(input.id);

    if (!message) {
      return {
        success: false,
        error: 'MESSAGE_NOT_FOUND',
      };
    }

    if (!message.isDeleted) {
      return {
        success: false,
        error: 'NOT_DELETED',
      };
    }

    message.restore();
    await this.messageRepository.save(message);

    return {
      success: true,
    };
  }
}

export interface RestoreMessageInput {
  id: string;
}

export interface RestoreMessageOutput {
  success: boolean;
  error?: 'MESSAGE_NOT_FOUND' | 'NOT_DELETED';
}