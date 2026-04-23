import { Injectable, Inject } from '@nestjs/common';
import { MessageRepository, MessageVersionRepository, MessageVersion, MESSAGE_REPOSITORY, MESSAGE_VERSION_REPOSITORY } from '../../../domain';

/**
 * EditMessageUseCase
 *
 * Caso de uso para editar o conteúdo de uma mensagem.
 * Cria uma nova versão preservando o histórico.
 *
 * Regras de negócio:
 * - Mensagem deve existir
 * - Mensagem não deve estar deletada
 * - Conteúdo obrigatório
 */
@Injectable()
export class EditMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(MESSAGE_VERSION_REPOSITORY)
    private readonly messageVersionRepository: MessageVersionRepository,
  ) {}

  async execute(input: EditMessageInput): Promise<EditMessageOutput> {
    const message = await this.messageRepository.findById(input.messageId);

    if (!message) {
      return {
        success: false,
        error: 'MESSAGE_NOT_FOUND',
      };
    }

    if (message.isDeleted) {
      return {
        success: false,
        error: 'MESSAGE_DELETED',
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
        editedAt: version.createdAt,
      },
    };
  }
}

export interface EditMessageInput {
  messageId: string;
  content: string;
  editedBy?: string;
}

export interface EditMessageOutput {
  success: boolean;
  error?: 'MESSAGE_NOT_FOUND' | 'MESSAGE_DELETED' | 'INVALID_CONTENT';
  message?: {
    id: string;
    conversationId: string;
    role: string;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
    editedAt: Date;
  };
}