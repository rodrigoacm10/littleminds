import {
  BadRequestException,
  type ExecutionContext,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PostSupportController } from './post-support.controller';
import {
  CheckUserSupportUseCase,
  CreatePostSupportUseCase,
  DeletePostSupportUseCase,
  FindPostSupportsByPostUseCase,
} from '../../application/use-cases';
import {
  FORUM_POST_REPOSITORY,
  ForumPost,
  POST_SUPPORT_REPOSITORY,
  Role,
  TOKEN_SERVICE,
  USER_REPOSITORY,
  User,
} from '../../domain';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { JwtTokenService } from '../../infra/auth/jwt-token.service';
import {
  InMemoryForumPostRepository,
  InMemoryPostSupportRepository,
  InMemoryUserRepository,
} from '../../test-support/in-memory-repositories';
import { CreatePostSupportData } from './dto';

describe('PostSupportController Integration', () => {
  let app: INestApplication;
  let controller: PostSupportController;
  let guard: JwtAuthGuard;
  let tokenService: JwtTokenService;
  let validationPipe: ValidationPipe;

  const userId = '550e8400-e29b-41d4-a716-446655440010';
  const postId = '550e8400-e29b-41d4-a716-446655440011';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostSupportController],
      providers: [
        CreatePostSupportUseCase,
        FindPostSupportsByPostUseCase,
        DeletePostSupportUseCase,
        CheckUserSupportUseCase,
        JwtAuthGuard,
        JwtTokenService,
        {
          provide: USER_REPOSITORY,
          useValue: new InMemoryUserRepository(),
        },
        {
          provide: FORUM_POST_REPOSITORY,
          useValue: new InMemoryForumPostRepository(),
        },
        {
          provide: POST_SUPPORT_REPOSITORY,
          useValue: new InMemoryPostSupportRepository(),
        },
        {
          provide: TOKEN_SERVICE,
          useExisting: JwtTokenService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    controller = moduleRef.get(PostSupportController);
    guard = moduleRef.get(JwtAuthGuard);
    tokenService = moduleRef.get(JwtTokenService);
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    const userRepository = moduleRef.get<InMemoryUserRepository>(USER_REPOSITORY);
    const forumPostRepository =
      moduleRef.get<InMemoryForumPostRepository>(FORUM_POST_REPOSITORY);

    await userRepository.save(
      User.reconstitute(
        userId,
        'Maria',
        'maria@example.com',
        'hashed-password',
        Role.PARENT,
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-01T00:00:00.000Z'),
      ),
    );
    await forumPostRepository.save(
      ForumPost.reconstitute(
        postId,
        'Post',
        'Conteúdo',
        userId,
        null,
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-01T00:00:00.000Z'),
      ),
    );
  });

  afterEach(async () => {
    await app.close();
  });

  async function authenticate() {
    const token = await tokenService.sign({
      sub: userId,
      email: 'maria@example.com',
      role: Role.PARENT,
    });
    const request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Record<string, unknown>;
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    await guard.canActivate(context);
    return request;
  }

  it('validates support payloads through ValidationPipe', async () => {
    await expect(
      validationPipe.transform(
        {
          postId: 'invalid-uuid',
        },
        {
          type: 'body',
          metatype: CreatePostSupportData,
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates support, detects duplicate, checks support and removes it', async () => {
    const request = await authenticate();
    const body = (await validationPipe.transform(
      {
        postId,
      },
      {
        type: 'body',
        metatype: CreatePostSupportData,
      },
    )) as CreatePostSupportData;

    const createResponse = await controller.create(body, request as never);
    expect(createResponse).toMatchObject({
      success: true,
      support: {
        postId,
        userId,
      },
    });

    const duplicateResponse = await controller.create(body, request as never);
    expect(duplicateResponse).toEqual({
      success: false,
      error: 'ALREADY_SUPPORTED',
    });

    const checkResponse = await controller.checkUserSupport(
      request as never,
      postId,
    );
    expect(checkResponse).toEqual({
      success: true,
      hasSupported: true,
      totalSupports: 1,
    });

    const listResponse = await controller.findByPost(postId);
    expect(listResponse).toMatchObject({
      success: true,
      total: 1,
      supports: [{ postId, userId }],
    });

    const deleteResponse = await controller.remove(request as never, postId);
    expect(deleteResponse).toEqual({ success: true });
  });
});
