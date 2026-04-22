import { Injectable, Inject } from '@nestjs/common';
import { UserRepository, Role, USER_REPOSITORY } from '../../../domain';

/**
 * FindAllUsersUseCase
 *
 * Caso de uso para listar todos os usuários.
 * Opcionalmente filtra por role.
 */
@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input?: FindAllUsersInput): Promise<FindAllUsersOutput> {
    const users = input?.role
      ? await this.userRepository.findByRole(input.role)
      : await this.userRepository.findAll();

    return {
      success: true,
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email.value,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    };
  }
}

export interface FindAllUsersInput {
  role?: Role;
}

export interface FindAllUsersOutput {
  success: boolean;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }>;
}