import {
  BadRequestException,
  UnauthorizedException,
  type ExecutionContext,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import {
  CreateArticleUseCase,
  DeleteArticleUseCase,
  FindAllArticlesUseCase,
  FindArticleByIdUseCase,
  PublishArticleUseCase,
  UnpublishArticleUseCase,
  UpdateArticleUseCase,
} from '../../application/use-cases';
import {
  ARTICLE_REPOSITORY,
  Role,
  TOKEN_SERVICE,
  USER_REPOSITORY,
  User,
} from '../../domain';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { JwtTokenService } from '../../infra/auth/jwt-token.service';
import {
  InMemoryArticleRepository,
  InMemoryUserRepository,
} from '../../test-support/in-memory-repositories';
import { CreateArticleData } from './dto';

describe('ArticleController Integration', () => {
  let app: INestApplication;
  let controller: ArticleController;
  let guard: JwtAuthGuard;
  let tokenService: JwtTokenService;
  let validationPipe: ValidationPipe;
  let userRepository: InMemoryUserRepository;

  const makeUser = (id: string, role: Role) =>
    User.reconstitute(
      id,
      role === Role.PARENT ? 'Pai' : 'Especialista',
      `${id}@example.com`,
      'hashed-password',
      role,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();

    const moduleRef = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        CreateArticleUseCase,
        FindAllArticlesUseCase,
        JwtAuthGuard,
        JwtTokenService,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
        {
          provide: ARTICLE_REPOSITORY,
          useValue: new InMemoryArticleRepository(),
        },
        {
          provide: TOKEN_SERVICE,
          useExisting: JwtTokenService,
        },
        {
          provide: FindArticleByIdUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateArticleUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: PublishArticleUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UnpublishArticleUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteArticleUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    controller = moduleRef.get(ArticleController);
    guard = moduleRef.get(JwtAuthGuard);
    tokenService = moduleRef.get(JwtTokenService);
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    await userRepository.save(makeUser('specialist-1', Role.SPECIALIST));
    await userRepository.save(makeUser('parent-1', Role.PARENT));
  });

  afterEach(async () => {
    await app.close();
  });

  async function authenticate(userId: string, role: Role) {
    const token = await tokenService.sign({
      sub: userId,
      email: `${userId}@example.com`,
      role,
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

  it('rejects unauthenticated article creation through the guard', async () => {
    const request = {
      headers: {},
    } as Record<string, unknown>;
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('validates create article payloads before hitting the use case', async () => {
    await expect(
      validationPipe.transform(
        {
          title: 'Artigo',
          content: 'Conteúdo',
          ageGroup: 'INVALID_ENUM',
        },
        {
          type: 'body',
          metatype: CreateArticleData,
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns the business error when a parent tries to create an article', async () => {
    const request = await authenticate('parent-1', Role.PARENT);
    const body = (await validationPipe.transform(
      {
        title: 'Artigo',
        content: 'Conteúdo',
      },
      {
        type: 'body',
        metatype: CreateArticleData,
      },
    )) as CreateArticleData;

    const response = await controller.create(body, request as never);

    expect(response).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
  });

  it('creates the article for a specialist and exposes it in the list use case route', async () => {
    const request = await authenticate('specialist-1', Role.SPECIALIST);
    const body = (await validationPipe.transform(
      {
        title: 'Guia do sono',
        content: 'Conteúdo do artigo',
        summary: 'Resumo útil',
      },
      {
        type: 'body',
        metatype: CreateArticleData,
      },
    )) as CreateArticleData;

    const createResponse = await controller.create(body, request as never);

    expect(createResponse).toMatchObject({
      success: true,
      article: {
        title: 'Guia do sono',
        content: 'Conteúdo do artigo',
        summary: 'Resumo útil',
        authorId: 'specialist-1',
        isPublished: false,
      },
    });

    const listResponse = await controller.findAll();

    expect(listResponse).toMatchObject({
      success: true,
      articles: [
        {
          title: 'Guia do sono',
          authorId: 'specialist-1',
        },
      ],
    });
  });
});
