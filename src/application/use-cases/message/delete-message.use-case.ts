import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../../../domain';

/**
 * DeleteMessageUseCase
 *
 * Caso de uso para deletar uma mensagem (soft delete).
 *
 * Regras de negócio:
 * - Mensagem deve existir
 * - Mensagem não deve estar já deletada
 */
@Injectable()
export class DeleteMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(input: DeleteMessageInput): Promise<DeleteMessageOutput> {
    const message = await this.messageRepository.findById(input.id);

    if (!message) {
      return {
        success: false,
        error: 'MESSAGE_NOT_FOUND',
      };
    }

    if (message.isDeleted) {
      return {
        success: false,
        error: 'ALREADY_DELETED',
      };
    }

    message.delete();
    await this.messageRepository.save(message);

    return {
      success: true,
    };
  }
}

export interface DeleteMessageInput {
  id: string;
}

export interface DeleteMessageOutput {
  success: boolean;
  error?: 'MESSAGE_NOT_FOUND' | 'ALREADY_DELETED';
}