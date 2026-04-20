import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain';

/**
 * DeleteUserUseCase
 *
 * Caso de uso para remover um usuário.
 *
 * Regras de negócio:
 * - Usuário deve existir
 */
@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    const exists = await this.userRepository.existsById(input.id);

    if (!exists) {
      return {
        success: false,
        error: 'USER_NOT_FOUND',
      };
    }

    await this.userRepository.delete(input.id);

    return {
      success: true,
    };
  }
}

export interface DeleteUserInput {
  id: string;
}

export interface DeleteUserOutput {
  success: boolean;
  error?: 'USER_NOT_FOUND';
}