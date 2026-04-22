import { Injectable, Inject } from '@nestjs/common';
import { User, UserRepository, Role, USER_REPOSITORY } from '../../../domain';

/**
 * CreateUserUseCase
 *
 * Caso de uso para criar um novo usuário no sistema.
 *
 * Regras de negócio:
 * - Email deve ser único
 * - Senha deve ter no mínimo 6 caracteres
 * - Nome é obrigatório
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      return {
        success: false,
        error: 'EMAIL_ALREADY_EXISTS',
      };
    }

    const user = User.create(
      crypto.randomUUID(),
      input.name,
      input.email,
      input.password,
      input.role ?? Role.PARENT,
    );

    if (!user) {
      return {
        success: false,
        error: 'INVALID_DATA',
      };
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
      },
    };
  }
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface CreateUserOutput {
  success: boolean;
  error?: 'EMAIL_ALREADY_EXISTS' | 'INVALID_DATA';
  user?: {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
  };
}