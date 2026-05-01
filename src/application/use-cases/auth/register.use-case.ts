import { Inject, Injectable } from '@nestjs/common';
import {
  PASSWORD_HASHER_SERVICE,
  PasswordHasherService,
  Role,
  USER_REPOSITORY,
  User,
  UserRepository,
} from '../../../domain';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER_SERVICE)
    private readonly passwordHasherService: PasswordHasherService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      return {
        success: false,
        error: 'EMAIL_ALREADY_EXISTS',
      };
    }

    const hashedPassword = await this.passwordHasherService.hash(input.password);
    const user = User.create(
      crypto.randomUUID(),
      input.name,
      input.email,
      hashedPassword,
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

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface RegisterOutput {
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
