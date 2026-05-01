import { Injectable, Inject } from '@nestjs/common';
import {
  ConversationRepository,
  CONVERSATION_REPOSITORY,
  MessageRepository,
  MessageVersionRepository,
  MESSAGE_REPOSITORY,
  MESSAGE_VERSION_REPOSITORY,
  MessageRole,
} from '../../../domain';

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
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(MESSAGE_VERSION_REPOSITORY)
    private readonly messageVersionRepository: MessageVersionRepository,
  ) {}

  async execute(input: FindConversationByIdInput): Promise<FindConversationByIdOutput> {
    const conversation = await this.conversationRepository.findById(input.id);

    if (!conversation) {
      return {
        success: false,
        error: 'CONVERSATION_NOT_FOUND',
      };
    }

    const messages = await this.messageRepository.findByConversationId(input.id);
    const messagesWithContent = await Promise.all(
      messages
        .filter((message) => !message.isDeleted)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(async (message) => {
          const latestVersion = await this.messageVersionRepository.findLatestByMessageId(
            message.id,
          );

          return {
            id: message.id,
            conversationId: message.conversationId,
            role: message.role,
            content: latestVersion?.content ?? '',
            isDeleted: message.isDeleted,
            createdAt: message.createdAt,
          };
        }),
    );

    return {
      success: true,
      conversation: {
        id: conversation.id,
        userId: conversation.userId,
        title: conversation.title,
        isArchived: conversation.isArchived,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages: messagesWithContent,
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
    messages: Array<{
      id: string;
      conversationId: string;
      role: MessageRole;
      content: string;
      isDeleted: boolean;
      createdAt: Date;
    }>;
  };
}
