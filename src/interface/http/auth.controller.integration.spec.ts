import {
  BadRequestException,
  type ExecutionContext,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterUseCase, LoginUseCase } from '../../application/use-cases';
import {
  PASSWORD_HASHER_SERVICE,
  Role,
  TOKEN_SERVICE,
  USER_REPOSITORY,
} from '../../domain';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { JwtTokenService } from '../../infra/auth/jwt-token.service';
import { NodePasswordHasherService } from '../../infra/auth/password-hasher.service';
import { InMemoryUserRepository } from '../../test-support/in-memory-repositories';
import { LoginData, RegisterData } from './dto';

describe('AuthController Integration', () => {
  let app: INestApplication;
  let controller: AuthController;
  let guard: JwtAuthGuard;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        RegisterUseCase,
        LoginUseCase,
        JwtAuthGuard,
        NodePasswordHasherService,
        JwtTokenService,
        {
          provide: USER_REPOSITORY,
          useValue: new InMemoryUserRepository(),
        },
        {
          provide: PASSWORD_HASHER_SERVICE,
          useExisting: NodePasswordHasherService,
        },
        {
          provide: TOKEN_SERVICE,
          useExisting: JwtTokenService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    controller = moduleRef.get(AuthController);
    guard = moduleRef.get(JwtAuthGuard);
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it('rejects invalid register payloads via ValidationPipe', async () => {
    await expect(
      validationPipe.transform(
        {
          name: 'Maria',
          email: 'maria@example.com',
          password: 'secret123',
          extra: 'field',
        },
        {
          type: 'body',
          metatype: RegisterData,
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('registers, logs in and resolves the authenticated user via guard + /me', async () => {
    const registerBody = (await validationPipe.transform(
      {
        name: 'Maria',
        email: 'maria@example.com',
        password: 'secret123',
        role: Role.SPECIALIST,
      },
      {
        type: 'body',
        metatype: RegisterData,
      },
    )) as RegisterData;

    const registerResponse = await controller.register(registerBody);

    expect(registerResponse).toMatchObject({
      success: true,
      data: {
        name: 'Maria',
        email: 'maria@example.com',
        role: Role.SPECIALIST,
      },
    });

    const loginBody = (await validationPipe.transform(
      {
        email: 'maria@example.com',
        password: 'secret123',
      },
      {
        type: 'body',
        metatype: LoginData,
      },
    )) as LoginData;

    const loginResponse = await controller.login(loginBody);
    expect(loginResponse.success).toBe(true);

    const request = {
      headers: {
        authorization: `Bearer ${loginResponse.data.accessToken}`,
      },
    } as Record<string, unknown>;

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);

    const meResponse = await controller.me(request as never);
    expect(meResponse).toMatchObject({
      success: true,
      data: {
        name: 'Maria',
        email: 'maria@example.com',
        role: Role.SPECIALIST,
      },
    });
  });
});
