import { Injectable, Inject } from '@nestjs/common';
import { Conversation, ConversationRepository, UserRepository, CONVERSATION_REPOSITORY, USER_REPOSITORY } from '../../../domain';

/**
 * CreateConversationUseCase
 *
 * Caso de uso para criar uma nova conversa com o chatbot.
 *
 * Regras de negócio:
 * - Usuário deve existir
 * - Título obrigatório
 */
@Injectable()
export class CreateConversationUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateConversationInput): Promise<CreateConversationOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      return {
        success: false,
        error: 'USER_NOT_FOUND',
      };
    }

    const conversation = Conversation.create(
      crypto.randomUUID(),
      input.userId,
      input.title,
    );

    if (!conversation) {
      return {
        success: false,
        error: 'INVALID_DATA',
      };
    }

    await this.conversationRepository.save(conversation);

    return {
      success: true,
      conversation: {
        id: conversation.id,
        userId: conversation.userId,
        title: conversation.title,
        isArchived: conversation.isArchived,
        createdAt: conversation.createdAt,
      },
    };
  }
}

export interface CreateConversationInput {
  userId: string;
  title: string;
}

export interface CreateConversationOutput {
  success: boolean;
  error?: 'USER_NOT_FOUND' | 'INVALID_DATA';
  conversation?: {
    id: string;
    userId: string;
    title: string;
    isArchived: boolean;
    createdAt: Date;
  };
}