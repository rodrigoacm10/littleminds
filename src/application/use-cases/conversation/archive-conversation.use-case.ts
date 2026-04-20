import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../../../domain';

/**
 * ArchiveConversationUseCase
 *
 * Caso de uso para arquivar uma conversa.
 *
 * Regras de negócio:
 * - Conversa deve existir
 * - Apenas o dono pode arquivar
 */
@Injectable()
export class ArchiveConversationUseCase {
  constructor(private readonly conversationRepository: ConversationRepository) {}

  async execute(input: ArchiveConversationInput): Promise<ArchiveConversationOutput> {
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

    conversation.archive();
    await this.conversationRepository.save(conversation);

    return {
      success: true,
    };
  }
}

export interface ArchiveConversationInput {
  id: string;
  requesterId: string;
}

export interface ArchiveConversationOutput {
  success: boolean;
  error?: 'CONVERSATION_NOT_FOUND' | 'NOT_AUTHORIZED';
}