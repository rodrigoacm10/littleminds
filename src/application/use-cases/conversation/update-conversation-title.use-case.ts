import { Injectable, Inject } from '@nestjs/common';
import { ConversationRepository, CONVERSATION_REPOSITORY } from '../../../domain';

/**
 * UpdateConversationTitleUseCase
 *
 * Caso de uso para atualizar o título de uma conversa.
 *
 * Regras de negócio:
 * - Conversa deve existir
 * - Apenas o dono pode atualizar
 */
@Injectable()
export class UpdateConversationTitleUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(input: UpdateConversationTitleInput): Promise<UpdateConversationTitleOutput> {
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

    conversation.updateTitle(input.title);

    await this.conversationRepository.save(conversation);

    return {
      success: true,
      conversation: {
        id: conversation.id,
        userId: conversation.userId,
        title: conversation.title,
        isArchived: conversation.isArchived,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
    };
  }
}

export interface UpdateConversationTitleInput {
  id: string;
  requesterId: string;
  title: string;
}

export interface UpdateConversationTitleOutput {
  success: boolean;
  error?: 'CONVERSATION_NOT_FOUND' | 'NOT_AUTHORIZED';
  conversation?: {
    id: string;
    userId: string;
    title: string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}