import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../../../domain';

/**
 * DeleteConversationUseCase
 *
 * Caso de uso para remover uma conversa.
 *
 * Regras de negócio:
 * - Conversa deve existir
 * - Apenas o dono pode remover
 */
@Injectable()
export class DeleteConversationUseCase {
  constructor(private readonly conversationRepository: ConversationRepository) {}

  async execute(input: DeleteConversationInput): Promise<DeleteConversationOutput> {
    const conversation = await this.conversationRepository.findById(input.id);

    if (!conversation) {
      return {
        success: false,
        error: 'CONVERSATION_NOT_FOUND',
      };
    }

    if (!conversation.belongsToUser(input.requesterId)) {
      return {
        success: false,
        error: 'NOT_AUTHORIZED',
      };
    }

    await this.conversationRepository.delete(input.id);

    return {
      success: true,
    };
  }
}

export interface DeleteConversationInput {
  id: string;
  requesterId: string;
}

export interface DeleteConversationOutput {
  success: boolean;
  error?: 'CONVERSATION_NOT_FOUND' | 'NOT_AUTHORIZED';
}