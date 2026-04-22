import { Injectable, Inject } from '@nestjs/common';
import { ConversationRepository, CONVERSATION_REPOSITORY } from '../../../domain';

/**
 * FindConversationByIdUseCase
 *
 * Caso de uso para buscar uma conversa pelo ID.
 */
@Injectable()
export class FindConversationByIdUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(input: FindConversationByIdInput): Promise<FindConversationByIdOutput> {
    const conversation = await this.conversationRepository.findById(input.id);

    if (!conversation) {
      return {
        success: false,
        error: 'CONVERSATION_NOT_FOUND',
      };
    }

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

export interface FindConversationByIdInput {
  id: string;
}

export interface FindConversationByIdOutput {
  success: boolean;
  error?: 'CONVERSATION_NOT_FOUND';
  conversation?: {
    id: string;
    userId: string;
    title: string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}