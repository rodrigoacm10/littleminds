import { Inject, Injectable } from '@nestjs/common';
import {
  AI_CHAT_SERVICE,
  AIChatService,
  CONVERSATION_REPOSITORY,
  ConversationRepository,
  MESSAGE_REPOSITORY,
  MESSAGE_VERSION_REPOSITORY,
  Message,
  MessageRepository,
  MessageRole,
  MessageVersion,
  MessageVersionRepository,
} from '../../../domain';

@Injectable()
export class SendMessageToConversationUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(MESSAGE_VERSION_REPOSITORY)
    private readonly messageVersionRepository: MessageVersionRepository,
    @Inject(AI_CHAT_SERVICE)
    private readonly aiChatService: AIChatService,
  ) {}

  async execute(
    input: SendMessageToConversationInput,
  ): Promise<SendMessageToConversationOutput> {
    const conversation = await this.conversationRepository.findById(
      input.conversationId,
    );

    if (!conversation) {
      return {
        success: false,
        error: 'CONVERSATION_NOT_FOUND',
      };
    }

    if (!conversation.belongsToUser(input.userId)) {
      return {
        success: false,
        error: 'CONVERSATION_NOT_FOUND',
      };
    }

    if (conversation.isArchived) {
      return {
        success: false,
        error: 'CONVERSATION_ARCHIVED',
      };
    }

    const userMessage = Message.create(
      crypto.randomUUID(),
      input.conversationId,
      MessageRole.USER,
    );

    if (!userMessage) {
      return {
        success: false,
        error: 'INVALID_MESSAGE',
      };
    }

    const userVersion = MessageVersion.create(
      crypto.randomUUID(),
      userMessage.id,
      input.content,
      input.userId,
    );

    if (!userVersion) {
      return {
        success: false,
        error: 'INVALID_MESSAGE',
      };
    }

    await this.messageRepository.save(userMessage);
    await this.messageVersionRepository.save(userVersion);

    const history = await this.messageRepository.findByConversationId(
      input.conversationId,
    );

    const orderedMessages = await Promise.all(
      history
        .filter((message) => !message.isDeleted)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(async (message) => {
          const version =
            await this.messageVersionRepository.findLatestByMessageId(message.id);

          return {
            role: message.role,
            content: version?.content ?? '',
          };
        }),
    );

    let assistantContent: string;

    try {
      assistantContent = await this.aiChatService.generateReply(
        orderedMessages.filter((message) => message.content.trim().length > 0),
      );
    } catch {
      return {
        success: false,
        error: 'AI_RESPONSE_FAILED',
      };
    }

    const assistantMessage = Message.create(
      crypto.randomUUID(),
      input.conversationId,
      MessageRole.ASSISTANT,
    );

    if (!assistantMessage) {
      return {
        success: false,
        error: 'AI_RESPONSE_FAILED',
      };
    }

    const assistantVersion = MessageVersion.create(
      crypto.randomUUID(),
      assistantMessage.id,
      assistantContent,
      'gemini',
    );

    if (!assistantVersion) {
      return {
        success: false,
        error: 'AI_RESPONSE_FAILED',
      };
    }

    await this.messageRepository.save(assistantMessage);
    await this.messageVersionRepository.save(assistantVersion);

    return {
      success: true,
      userMessage: {
        id: userMessage.id,
        conversationId: userMessage.conversationId,
        role: userMessage.role,
        content: userVersion.content,
        isDeleted: userMessage.isDeleted,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id,
        conversationId: assistantMessage.conversationId,
        role: assistantMessage.role,
        content: assistantVersion.content,
        isDeleted: assistantMessage.isDeleted,
        createdAt: assistantMessage.createdAt,
      },
    };
  }
}

export interface SendMessageToConversationInput {
  conversationId: string;
  userId: string;
  content: string;
}

export interface SendMessageToConversationOutput {
  success: boolean;
  error?:
    | 'CONVERSATION_NOT_FOUND'
    | 'CONVERSATION_ARCHIVED'
    | 'INVALID_MESSAGE'
    | 'AI_RESPONSE_FAILED';
  userMessage?: {
    id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
  };
  assistantMessage?: {
    id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
  };
}
