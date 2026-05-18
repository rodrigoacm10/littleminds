import {
  BadRequestException,
  type ExecutionContext,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import {
  CreateCommentUseCase,
  DeleteCommentUseCase,
  FindAllCommentsUseCase,
  FindCommentByIdUseCase,
  UpdateCommentUseCase,
} from '../../application/use-cases';
import {
  COMMENT_REPOSITORY,
  FORUM_POST_REPOSITORY,
  ForumPost,
  Role,
  TOKEN_SERVICE,
  USER_REPOSITORY,
  User,
} from '../../domain';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { JwtTokenService } from '../../infra/auth/jwt-token.service';
import {
  InMemoryCommentRepository,
  InMemoryForumPostRepository,
  InMemoryUserRepository,
} from '../../test-support/in-memory-repositories';
import { CreateCommentData, UpdateCommentData } from './dto';

describe('CommentController Integration', () => {
  let app: INestApplication;
  let controller: CommentController;
  let guard: JwtAuthGuard;
  let tokenService: JwtTokenService;
  let validationPipe: ValidationPipe;

  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const postId = '550e8400-e29b-41d4-a716-446655440001';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CreateCommentUseCase,
        FindCommentByIdUseCase,
        FindAllCommentsUseCase,
        UpdateCommentUseCase,
        DeleteCommentUseCase,
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
          provide: COMMENT_REPOSITORY,
          useValue: new InMemoryCommentRepository(),
        },
        {
          provide: TOKEN_SERVICE,
          useExisting: JwtTokenService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    controller = moduleRef.get(CommentController);
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

  it('validates comment payloads through ValidationPipe', async () => {
    await expect(
      validationPipe.transform(
        {
          postId: 'invalid-uuid',
          content: 'Comentário',
        },
        {
          type: 'body',
          metatype: CreateCommentData,
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates, lists, updates and deletes a comment', async () => {
    const request = await authenticate();

    const createBody = (await validationPipe.transform(
      {
        postId,
        content: 'Comentário inicial',
      },
      {
        type: 'body',
        metatype: CreateCommentData,
      },
    )) as CreateCommentData;

    const createResponse = await controller.create(createBody, request as never);
    expect(createResponse).toMatchObject({
      success: true,
      comment: {
        postId,
        authorId: userId,
      },
    });

    const commentId = createResponse.comment.id;

    const listResponse = await controller.findAll(postId);
    expect(listResponse).toMatchObject({
      success: true,
      comments: [{ id: commentId }],
    });

    const updateBody = (await validationPipe.transform(
      {
        content: 'Comentário editado',
      },
      {
        type: 'body',
        metatype: UpdateCommentData,
      },
    )) as UpdateCommentData;

    const updateResponse = await controller.update(
      commentId,
      updateBody,
      request as never,
    );
    expect(updateResponse).toMatchObject({
      success: true,
      comment: {
        id: commentId,
        content: 'Comentário editado',
      },
    });

    const findResponse = await controller.findOne(commentId);
    expect(findResponse).toMatchObject({
      success: true,
      comment: {
        id: commentId,
        content: 'Comentário editado',
      },
    });

    const deleteResponse = await controller.remove(commentId, request as never);
    expect(deleteResponse).toEqual({ success: true });
  });
});
