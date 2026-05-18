import {
  BadRequestException,
  ForbiddenException,
  type ExecutionContext,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConversationController } from './conversation.controller';
import {
  ArchiveConversationUseCase,
  CreateConversationUseCase,
  DeleteConversationUseCase,
  FindAllConversationsUseCase,
  FindConversationByIdUseCase,
  SendMessageToConversationUseCase,
  UnarchiveConversationUseCase,
  UpdateConversationTitleUseCase,
} from '../../application/use-cases';
import {
  AI_CHAT_SERVICE,
  CONVERSATION_REPOSITORY,
  MESSAGE_REPOSITORY,
  MESSAGE_VERSION_REPOSITORY,
  Role,
  TOKEN_SERVICE,
  USER_REPOSITORY,
  Conversation,
  User,
  type AIChatService,
} from '../../domain';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { JwtTokenService } from '../../infra/auth/jwt-token.service';
import {
  InMemoryConversationRepository,
  InMemoryMessageRepository,
  InMemoryMessageVersionRepository,
  InMemoryUserRepository,
} from '../../test-support/in-memory-repositories';
import { CreateConversationData, SendMessageToConversationData } from './dto';

describe('ConversationController Integration', () => {
  let app: INestApplication;
  let controller: ConversationController;
  let guard: JwtAuthGuard;
  let tokenService: JwtTokenService;
  let validationPipe: ValidationPipe;
  let conversationRepository: InMemoryConversationRepository;
  let userRepository: InMemoryUserRepository;
  let aiChatService: jest.Mocked<AIChatService>;

  const makeUser = (id: string) =>
    User.reconstitute(
      id,
      id === 'user-1' ? 'Maria' : 'João',
      `${id}@example.com`,
      'hashed-password',
      Role.PARENT,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  beforeEach(async () => {
    conversationRepository = new InMemoryConversationRepository();
    userRepository = new InMemoryUserRepository();
    aiChatService = {
      generateReply: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        CreateConversationUseCase,
        FindConversationByIdUseCase,
        SendMessageToConversationUseCase,
        JwtAuthGuard,
        JwtTokenService,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
        {
          provide: CONVERSATION_REPOSITORY,
          useValue: conversationRepository,
        },
        {
          provide: MESSAGE_REPOSITORY,
          useValue: new InMemoryMessageRepository(),
        },
        {
          provide: MESSAGE_VERSION_REPOSITORY,
          useValue: new InMemoryMessageVersionRepository(),
        },
        {
          provide: AI_CHAT_SERVICE,
          useValue: aiChatService,
        },
        {
          provide: TOKEN_SERVICE,
          useExisting: JwtTokenService,
        },
        {
          provide: FindAllConversationsUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateConversationTitleUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ArchiveConversationUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UnarchiveConversationUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteConversationUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    controller = moduleRef.get(ConversationController);
    guard = moduleRef.get(JwtAuthGuard);
    tokenService = moduleRef.get(JwtTokenService);
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    await userRepository.save(makeUser('user-1'));
    await userRepository.save(makeUser('user-2'));
  });

  afterEach(async () => {
    await app.close();
  });

  async function authenticate(userId: string) {
    const token = await tokenService.sign({
      sub: userId,
      email: `${userId}@example.com`,
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

  it('rejects invalid create conversation payloads', async () => {
    await expect(
      validationPipe.transform(
        {
          title: 'Conversa',
          extra: 'field',
        },
        {
          type: 'body',
          metatype: CreateConversationData,
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns 403 when trying to read another user conversation', async () => {
    await conversationRepository.save(
      Conversation.reconstitute(
        'conversation-1',
        'user-2',
        'Privada',
        false,
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-01T00:00:00.000Z'),
      ),
    );

    const request = await authenticate('user-1');

    await expect(
      controller.findOne('conversation-1', request as never),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('returns archived conversation error in the chat route integration', async () => {
    await conversationRepository.save(
      Conversation.reconstitute(
        'conversation-1',
        'user-1',
        'Arquivada',
        true,
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-01T00:00:00.000Z'),
      ),
    );

    const request = await authenticate('user-1');
    const body = (await validationPipe.transform(
      {
        content: 'Posso voltar a falar aqui?',
      },
      {
        type: 'body',
        metatype: SendMessageToConversationData,
      },
    )) as SendMessageToConversationData;

    const response = await controller.chat('conversation-1', body, request as never);

    expect(response).toEqual({
      success: false,
      error: 'CONVERSATION_ARCHIVED',
    });
    expect(aiChatService.generateReply).not.toHaveBeenCalled();
  });
});
