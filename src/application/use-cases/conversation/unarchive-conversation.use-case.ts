import { Injectable, Inject } from '@nestjs/common';
import { ConversationRepository, CONVERSATION_REPOSITORY } from '../../../domain';

/**
 * UnarchiveConversationUseCase
 *
 * Caso de uso para desarquivar uma conversa.
 *
 * Regras de negócio:
 * - Conversa deve existir
 * - Apenas o dono pode desarquivar
 */
@Injectable()
export class UnarchiveConversationUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(input: UnarchiveConversationInput): Promise<UnarchiveConversationOutput> {
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

    conversation.unarchive();
    await this.conversationRepository.save(conversation);

    return {
      success: true,
    };
  }
}

export interface UnarchiveConversationInput {
  id: string;
  requesterId: string;
}

export interface UnarchiveConversationOutput {
  success: boolean;
  error?: 'CONVERSATION_NOT_FOUND' | 'NOT_AUTHORIZED';
}