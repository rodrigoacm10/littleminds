import { Injectable, Inject } from '@nestjs/common';
import { MessageVersion, MessageVersionRepository, MessageRepository, MESSAGE_VERSION_REPOSITORY, MESSAGE_REPOSITORY } from '../../../domain';

/**
 * CreateMessageVersionUseCase
 *
 * Caso de uso para criar uma nova versão de mensagem.
 *
 * Regras de negócio:
 * - Mensagem original deve existir
 * - Conteúdo é obrigatório
 * - editedBy deve ser 'user' ou 'system'
 */
@Injectable()
export class CreateMessageVersionUseCase {
  constructor(
    @Inject(MESSAGE_VERSION_REPOSITORY)
    private readonly messageVersionRepository: MessageVersionRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(input: CreateMessageVersionInput): Promise<CreateMessageVersionOutput> {
    const message = await this.messageRepository.findById(input.messageId);
    if (!message) {
      return {
        success: false,
        error: 'MESSAGE_NOT_FOUND',
      };
    }

    if (!['user', 'system'].includes(input.editedBy)) {
      return {
        success: false,
        error: 'INVALID_EDITOR',
      };
    }

    const version = MessageVersion.create(
      crypto.randomUUID(),
      input.messageId,
      input.content,
      input.editedBy,
    );

    if (!version) {
      return {
        success: false,
        error: 'INVALID_DATA',
      };
    }

    await this.messageVersionRepository.save(version);

    return {
      success: true,
      version: {
        id: version.id,
        messageId: version.messageId,
        content: version.content,
        editedBy: version.editedBy,
        createdAt: version.createdAt,
      },
    };
  }
}

export interface CreateMessageVersionInput {
  messageId: string;
  content: string;
  editedBy: string;
}

export interface CreateMessageVersionOutput {
  success: boolean;
  error?: 'MESSAGE_NOT_FOUND' | 'INVALID_EDITOR' | 'INVALID_DATA';
  version?: {
    id: string;
    messageId: string;
    content: string;
    editedBy: string;
    createdAt: Date;
  };
}
