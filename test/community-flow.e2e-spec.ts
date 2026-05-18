import {
  type ExecutionContext,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  AuthController,
  CommentController,
  ForumPostController,
  PostSupportController,
} from '../src/interface/http';
import { JwtAuthGuard } from '../src/interface/security/jwt-auth.guard';
import {
  CreateCommentData,
  CreateForumPostData,
  CreatePostSupportData,
  LoginData,
  RegisterData,
} from '../src/interface/http/dto';
import { Role } from '../src/domain';
import { E2ETestModule } from './e2e-test-module';

describe('Community Flow (e2e)', () => {
  let app: INestApplication;
  let authController: AuthController;
  let forumPostController: ForumPostController;
  let commentController: CommentController;
  let postSupportController: PostSupportController;
  let guard: JwtAuthGuard;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [E2ETestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    authController = moduleRef.get(AuthController);
    forumPostController = moduleRef.get(ForumPostController);
    commentController = moduleRef.get(CommentController);
    postSupportController = moduleRef.get(PostSupportController);
    guard = moduleRef.get(JwtAuthGuard);
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  async function validateBody<T>(
    body: object,
    metatype: new () => T,
  ): Promise<T> {
    return validationPipe.transform(body, {
      type: 'body',
      metatype,
    }) as Promise<T>;
  }

  async function authenticate(accessToken: string) {
    const request = {
      headers: {
        authorization: `Bearer ${accessToken}`,
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

  it('registers, logs in, creates a forum post, comments and supports it', async () => {
    const registerUser = await validateBody(
      {
        name: 'Maria',
        email: 'maria@example.com',
        password: 'secret123',
        role: Role.PARENT,
      },
      RegisterData,
    );

    const registerSupporter = await validateBody(
      {
        name: 'Joao',
        email: 'joao@example.com',
        password: 'secret123',
        role: Role.PARENT,
      },
      RegisterData,
    );

    const mariaRegisterResponse = await authController.register(registerUser);
    const joaoRegisterResponse =
      await authController.register(registerSupporter);

    expect(mariaRegisterResponse.success).toBe(true);
    expect(joaoRegisterResponse.success).toBe(true);

    const mariaLogin = await authController.login(
      await validateBody(
        {
          email: 'maria@example.com',
          password: 'secret123',
        },
        LoginData,
      ),
    );

    const joaoLogin = await authController.login(
      await validateBody(
        {
          email: 'joao@example.com',
          password: 'secret123',
        },
        LoginData,
      ),
    );

    const mariaRequest = await authenticate(
      mariaLogin?.data?.accessToken || '',
    );
    const joaoRequest = await authenticate(joaoLogin?.data?.accessToken || '');

    const createPostResponse = await forumPostController.create(
      await validateBody(
        {
          title: 'Meu filho não dorme bem',
          content: 'Queria trocar experiências sobre rotina de sono.',
        },
        CreateForumPostData,
      ),
      mariaRequest as never,
    );

    expect(createPostResponse).toMatchObject({
      success: true,
      post: {
        title: 'Meu filho não dorme bem',
        authorId: mariaRegisterResponse?.data?.id,
      },
    });

    const postId = createPostResponse?.post?.id;

    const commentResponse = await commentController.create(
      await validateBody(
        {
          postId,
          content:
            'Passei por isso também, rotina consistente ajudou bastante.',
        },
        CreateCommentData,
      ),
      joaoRequest as never,
    );

    expect(commentResponse).toMatchObject({
      success: true,
      comment: {
        postId,
        authorId: joaoRegisterResponse?.data?.id,
      },
    });

    const supportResponse = await postSupportController.create(
      await validateBody(
        {
          postId,
        },
        CreatePostSupportData,
      ),
      joaoRequest as never,
    );

    expect(supportResponse).toMatchObject({
      success: true,
      support: {
        postId,
        userId: joaoRegisterResponse?.data?.id,
      },
    });

    const forumListResponse = await forumPostController.findAll();
    const commentsResponse = await commentController.findAll(postId);
    const supportCheckResponse = await postSupportController.checkUserSupport(
      joaoRequest as never,
      postId || '',
    );
    const supportListResponse = await postSupportController.findByPost(
      postId || '',
    );

    expect(forumListResponse).toMatchObject({
      success: true,
      posts: [
        {
          id: postId,
          authorId: mariaRegisterResponse?.data?.id,
        },
      ],
    });
    expect(commentsResponse).toMatchObject({
      success: true,
      comments: [
        {
          postId,
          authorId: joaoRegisterResponse?.data?.id,
        },
      ],
    });
    expect(supportCheckResponse).toEqual({
      success: true,
      hasSupported: true,
      totalSupports: 1,
    });
    expect(supportListResponse).toMatchObject({
      success: true,
      total: 1,
      supports: [
        {
          postId,
          userId: joaoRegisterResponse?.data?.id,
        },
      ],
    });
  });
});
