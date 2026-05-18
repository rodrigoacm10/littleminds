import {
  type ExecutionContext,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthController, ConversationController } from '../src/interface/http';
import { JwtAuthGuard } from '../src/interface/security/jwt-auth.guard';
import {
  CreateConversationData,
  LoginData,
  RegisterData,
  SendMessageToConversationData,
} from '../src/interface/http/dto';
import { Role } from '../src/domain';
import { E2ETestModule, e2eAiChatService } from './e2e-test-module';

describe('Conversation Flow (e2e)', () => {
  let app: INestApplication;
  let authController: AuthController;
  let conversationController: ConversationController;
  let guard: JwtAuthGuard;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    e2eAiChatService.generateReply.mockReset();

    const moduleRef = await Test.createTestingModule({
      imports: [E2ETestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    authController = moduleRef.get(AuthController);
    conversationController = moduleRef.get(ConversationController);
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

  it('registers, logs in, creates a conversation, chats with AI and reads history', async () => {
    const registerResponse = await authController.register(
      await validateBody(
        {
          name: 'Maria',
          email: 'maria@example.com',
          password: 'secret123',
          role: Role.PARENT,
        },
        RegisterData,
      ),
    );

    expect(registerResponse.success).toBe(true);

    const loginResponse = await authController.login(
      await validateBody(
        {
          email: 'maria@example.com',
          password: 'secret123',
        },
        LoginData,
      ),
    );

    const request = await authenticate(loginResponse?.data?.accessToken || '');

    const createConversationResponse = await conversationController.create(
      await validateBody(
        {
          title: 'Dúvidas sobre sono',
        },
        CreateConversationData,
      ),
      request as never,
    );

    expect(createConversationResponse).toMatchObject({
      success: true,
      conversation: {
        title: 'Dúvidas sobre sono',
        userId: registerResponse?.data?.id,
      },
    });

    const conversationId = createConversationResponse?.conversation?.id;

    e2eAiChatService.generateReply.mockResolvedValue(
      'Uma rotina previsível pode ajudar bastante. Observe sinais de sono e horários.',
    );

    const chatResponse = await conversationController.chat(
      conversationId || '',
      await validateBody(
        {
          content: 'Meu filho está dormindo mal. O que devo observar primeiro?',
        },
        SendMessageToConversationData,
      ),
      request as never,
    );

    expect(chatResponse).toMatchObject({
      success: true,
      userMessage: {
        conversationId,
        content: 'Meu filho está dormindo mal. O que devo observar primeiro?',
      },
      assistantMessage: {
        conversationId,
        content:
          'Uma rotina previsível pode ajudar bastante. Observe sinais de sono e horários.',
      },
    });

    const listResponse = await conversationController.findAll(request as never);
    const detailResponse = await conversationController.findOne(
      conversationId || '',
      request as never,
    );

    expect(listResponse).toMatchObject({
      success: true,
      conversations: [
        {
          id: conversationId,
          userId: registerResponse?.data?.id,
        },
      ],
    });
    expect(detailResponse).toMatchObject({
      success: true,
      conversation: {
        id: conversationId,
        messages: [
          {
            role: 'user',
            content:
              'Meu filho está dormindo mal. O que devo observar primeiro?',
          },
          {
            role: 'assistant',
            content:
              'Uma rotina previsível pode ajudar bastante. Observe sinais de sono e horários.',
          },
        ],
      },
    });
    expect(e2eAiChatService.generateReply).toHaveBeenCalledTimes(1);
  });
});
