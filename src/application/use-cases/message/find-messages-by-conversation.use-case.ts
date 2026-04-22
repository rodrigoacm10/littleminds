import { Injectable, Inject } from '@nestjs/common';
import { MessageRepository, MessageVersionRepository, MESSAGE_REPOSITORY, MESSAGE_VERSION_REPOSITORY } from '../../../domain';

/**
 * FindMessagesByConversationUseCase
 *
 * Caso de uso para listar mensagens de uma conversa.
 * Retorna apenas mensagens não deletadas por padrão.
 */
@Injectable()
export class FindMessagesByConversationUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(MESSAGE_VERSION_REPOSITORY)
    private readonly messageVersionRepository: MessageVersionRepository,
  ) {}

  async execute(input: FindMessagesByConversationInput): Promise<FindMessagesByConversationOutput> {
    const messages = await this.messageRepository.findByConversationId(input.conversationId);

    const messagesWithContent = await Promise.all(
      messages
        .filter((m) => input.includeDeleted || !m.isDeleted)
        .map(async (message) => {
          const latestVersion = await this.messageVersionRepository.findLatestByMessageId(message.id);
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
      messages: messagesWithContent.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      ),
    };
  }
}

export interface FindMessagesByConversationInput {
  conversationId: string;
  includeDeleted?: boolean;
}

export interface FindMessagesByConversationOutput {
  success: boolean;
  messages: Array<{
    id: string;
    conversationId: string;
    role: string;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
  }>;
}