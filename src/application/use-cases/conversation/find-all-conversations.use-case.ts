import { Injectable, Inject } from '@nestjs/common';
import { ConversationRepository, CONVERSATION_REPOSITORY } from '../../../domain';

/**
 * FindAllConversationsUseCase
 *
 * Caso de uso para listar conversas de um usuário.
 * Opcionalmente filtra por arquivadas ou ativas.
 */
@Injectable()
export class FindAllConversationsUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(input: FindAllConversationsInput): Promise<FindAllConversationsOutput> {
    let conversations;

    if (input.archivedOnly) {
      conversations = await this.conversationRepository.findArchivedByUserId(input.userId);
    } else if (input.activeOnly) {
      conversations = await this.conversationRepository.findActiveByUserId(input.userId);
    } else {
      conversations = await this.conversationRepository.findByUserId(input.userId);
    }

    return {
      success: true,
      conversations: conversations.map((conversation) => ({
        id: conversation.id,
        userId: conversation.userId,
        title: conversation.title,
        isArchived: conversation.isArchived,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      })),
    };
  }
}

export interface FindAllConversationsInput {
  userId: string;
  archivedOnly?: boolean;
  activeOnly?: boolean;
}

export interface FindAllConversationsOutput {
  success: boolean;
  conversations: Array<{
    id: string;
    userId: string;
    title: string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
}