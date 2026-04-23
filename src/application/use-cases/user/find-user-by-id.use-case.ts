import { Injectable, Inject } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '../../../domain';

/**
 * FindUserByIdUseCase
 *
 * Caso de uso para buscar um usuário pelo ID.
 */
@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: FindUserByIdInput): Promise<FindUserByIdOutput> {
    const user = await this.userRepository.findById(input.id);

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

export interface FindUserByIdInput {
  id: string;
}

export interface FindUserByIdOutput {
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