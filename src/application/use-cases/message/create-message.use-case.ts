import { Injectable } from '@nestjs/common';
import { Message, MessageRepository, ConversationRepository, MessageVersion, MessageVersionRepository, MessageRole } from '../../../domain';

/**
 * CreateMessageUseCase
 *
 * Caso de uso para criar uma nova mensagem em uma conversa.
 *
 * Regras de negócio:
 * - Conversa deve existir
 * - Role deve ser válido (user ou assistant)
 * - Conteúdo obrigatório
 */
@Injectable()
export class CreateMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageVersionRepository: MessageVersionRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(input: CreateMessageInput): Promise<CreateMessageOutput> {
    const conversation = await this.conversationRepository.findById(input.conversationId);
    if (!conversation) {
      return {
        success: false,
        error: 'CONVERSATION_NOT_FOUND',
      };
    }

    const message = Message.create(
      crypto.randomUUID(),
      input.conversationId,
      input.role,
    );

    if (!message) {
      return {
        success: false,
        error: 'INVALID_DATA',
      };
    }

    const version = MessageVersion.create(
      crypto.randomUUID(),
      message.id,
      input.content,
      input.editedBy ?? 'user',
    );

    if (!version) {
      return {
        success: false,
        error: 'INVALID_CONTENT',
      };
    }

    await this.messageRepository.save(message);
    await this.messageVersionRepository.save(version);

    return {
      success: true,
      message: {
        id: message.id,
        conversationId: message.conversationId,
        role: message.role,
        content: version.content,
        isDeleted: message.isDeleted,
        createdAt: message.createdAt,
      },
    };
  }
}

export interface CreateMessageInput {
  conversationId: string;
  role: MessageRole;
  content: string;
  editedBy?: string;
}

export interface CreateMessageOutput {
  success: boolean;
  error?: 'CONVERSATION_NOT_FOUND' | 'INVALID_DATA' | 'INVALID_CONTENT';
  message?: {
    id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
  };
}