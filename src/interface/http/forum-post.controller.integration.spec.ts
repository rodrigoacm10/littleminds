import {
  BadRequestException,
  type ExecutionContext,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ForumPostController } from './forum-post.controller';
import {
  CreateForumPostUseCase,
  DeleteForumPostUseCase,
  FindAllForumPostsUseCase,
  FindForumPostByIdUseCase,
  UpdateForumPostUseCase,
} from '../../application/use-cases';
import {
  FORUM_POST_REPOSITORY,
  Role,
  TOKEN_SERVICE,
  USER_REPOSITORY,
  User,
} from '../../domain';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { JwtTokenService } from '../../infra/auth/jwt-token.service';
import {
  InMemoryForumPostRepository,
  InMemoryUserRepository,
} from '../../test-support/in-memory-repositories';
import { CreateForumPostData, UpdateForumPostData } from './dto';

describe('ForumPostController Integration', () => {
  let app: INestApplication;
  let controller: ForumPostController;
  let guard: JwtAuthGuard;
  let tokenService: JwtTokenService;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ForumPostController],
      providers: [
        CreateForumPostUseCase,
        FindForumPostByIdUseCase,
        FindAllForumPostsUseCase,
        UpdateForumPostUseCase,
        DeleteForumPostUseCase,
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
          provide: TOKEN_SERVICE,
          useExisting: JwtTokenService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    controller = moduleRef.get(ForumPostController);
    guard = moduleRef.get(JwtAuthGuard);
    tokenService = moduleRef.get(JwtTokenService);
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    const userRepository = moduleRef.get<InMemoryUserRepository>(USER_REPOSITORY);
    await userRepository.save(
      User.reconstitute(
        '11111111-1111-1111-1111-111111111111',
        'Maria',
        'maria@example.com',
        'hashed-password',
        Role.PARENT,
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
      sub: '11111111-1111-1111-1111-111111111111',
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

  it('validates forum post payloads through ValidationPipe', async () => {
    await expect(
      validationPipe.transform(
        {
          title: 'Post',
          content: 'Conteúdo',
          ageGroup: 'INVALID_ENUM',
        },
        {
          type: 'body',
          metatype: CreateForumPostData,
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates, lists, updates and deletes a forum post', async () => {
    const request = await authenticate();

    const createBody = (await validationPipe.transform(
      {
        title: 'Meu filho não dorme',
        content: 'Queria trocar experiências.',
      },
      {
        type: 'body',
        metatype: CreateForumPostData,
      },
    )) as CreateForumPostData;

    const createResponse = await controller.create(createBody, request as never);
    expect(createResponse).toMatchObject({
      success: true,
      post: {
        title: 'Meu filho não dorme',
        authorId: '11111111-1111-1111-1111-111111111111',
      },
    });

    const postId = createResponse.post.id;

    const listResponse = await controller.findAll();
    expect(listResponse).toMatchObject({
      success: true,
      posts: [{ id: postId }],
    });

    const updateBody = (await validationPipe.transform(
      {
        title: 'Meu filho melhorou um pouco',
      },
      {
        type: 'body',
        metatype: UpdateForumPostData,
      },
    )) as UpdateForumPostData;

    const updateResponse = await controller.update(
      postId,
      updateBody,
      request as never,
    );
    expect(updateResponse).toMatchObject({
      success: true,
      post: {
        id: postId,
        title: 'Meu filho melhorou um pouco',
      },
    });

    const findResponse = await controller.findOne(postId);
    expect(findResponse).toMatchObject({
      success: true,
      post: {
        id: postId,
        title: 'Meu filho melhorou um pouco',
      },
    });

    const deleteResponse = await controller.remove(postId, request as never);
    expect(deleteResponse).toEqual({ success: true });
  });
});
