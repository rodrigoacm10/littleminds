import { Inject, Injectable } from '@nestjs/common';
import {
  PASSWORD_HASHER_SERVICE,
  PasswordHasherService,
  TOKEN_SERVICE,
  TokenService,
  USER_REPOSITORY,
  UserRepository,
} from '../../../domain';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER_SERVICE)
    private readonly passwordHasherService: PasswordHasherService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      return {
        success: false,
        error: 'INVALID_CREDENTIALS',
      };
    }

    const passwordMatches = await this.passwordHasherService.verify(
      input.password,
      user.toPersistence().password,
    );

    if (!passwordMatches) {
      return {
        success: false,
        error: 'INVALID_CREDENTIALS',
      };
    }

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      email: user.email.value,
      role: user.role,
    });

    return {
      success: true,
      accessToken,
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

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  success: boolean;
  error?: 'INVALID_CREDENTIALS';
  accessToken?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
