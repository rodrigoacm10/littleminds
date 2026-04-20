import { Injectable } from '@nestjs/common';
import { PostSupportRepository } from '../../../domain';

/**
 * DeletePostSupportUseCase
 *
 * Caso de uso para remover um apoio (undo "abraço virtual").
 *
 * Regras de negócio:
 * - Support deve existir
 * - Apenas o usuário que deu o support pode removê-lo
 */
@Injectable()
export class DeletePostSupportUseCase {
  constructor(private readonly postSupportRepository: PostSupportRepository) {}

  async execute(input: DeletePostSupportInput): Promise<DeletePostSupportOutput> {
    const support = await this.postSupportRepository.findByUserAndPost(
      input.userId,
      input.postId,
    );

    if (!support) {
      return {
        success: false,
        error: 'SUPPORT_NOT_FOUND',
      };
    }

    await this.postSupportRepository.delete(support.id);

    return {
      success: true,
    };
  }
}

export interface DeletePostSupportInput {
  userId: string;
  postId: string;
}

export interface DeletePostSupportOutput {
  success: boolean;
  error?: 'SUPPORT_NOT_FOUND';
}