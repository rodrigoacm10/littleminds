import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain';

/**
 * FindUserByEmailUseCase
 *
 * Caso de uso para buscar um usuário pelo email.
 */
@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: FindUserByEmailInput): Promise<FindUserByEmailOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      return {
        success: false,
        error: 'USER_NOT_FOUND',
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email.value,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

export interface FindUserByEmailInput {
  email: string;
}

export interface FindUserByEmailOutput {
  success: boolean;
  error?: 'USER_NOT_FOUND';
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}