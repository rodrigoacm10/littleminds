import { Injectable, Inject } from '@nestjs/common';
import {
  PASSWORD_HASHER_SERVICE,
  PasswordHasherService,
  UserRepository,
  USER_REPOSITORY,
} from '../../../domain';

/**
 * UpdateUserUseCase
 *
 * Caso de uso para atualizar dados de um usuário.
 *
 * Regras de negócio:
 * - Usuário deve existir
 * - Email, se alterado, deve ser único
 */
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER_SERVICE)
    private readonly passwordHasherService: PasswordHasherService,
  ) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      return {
        success: false,
        error: 'USER_NOT_FOUND',
      };
    }

    if (input.email && input.email !== user.email.value) {
      const emailExists = await this.userRepository.existsByEmail(input.email);
      if (emailExists) {
        return {
          success: false,
          error: 'EMAIL_ALREADY_EXISTS',
        };
      }
      user.updateEmail(input.email);
    }

    if (input.name) {
      user.updateName(input.name);
    }

    if (input.password) {
      const hashedPassword = await this.passwordHasherService.hash(input.password);
      const updated = user.updatePassword(hashedPassword);
      if (!updated) {
        return {
          success: false,
          error: 'INVALID_PASSWORD',
        };
      }
    }

    await this.userRepository.save(user);

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

export interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface UpdateUserOutput {
  success: boolean;
  error?: 'USER_NOT_FOUND' | 'EMAIL_ALREADY_EXISTS' | 'INVALID_PASSWORD';
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
