import {
  BadRequestException,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MessageController } from './message.controller';
import {
  CreateMessageUseCase,
  DeleteMessageUseCase,
  EditMessageUseCase,
  FindMessageByIdUseCase,
  FindMessagesByConversationUseCase,
  RestoreMessageUseCase,
} from '../../application/use-cases';
import {
  CONVERSATION_REPOSITORY,
  Conversation,
  MESSAGE_REPOSITORY,
  MESSAGE_VERSION_REPOSITORY,
  type ConversationRepository,
} from '../../domain';
import {
  InMemoryConversationRepository,
  InMemoryMessageRepository,
  InMemoryMessageVersionRepository,
} from '../../test-support/in-memory-repositories';
import { CreateMessageData, EditMessageData } from './dto';

describe('MessageController Integration', () => {
  let app: INestApplication;
  let controller: MessageController;
  let validationPipe: ValidationPipe;

  const conversationId = '550e8400-e29b-41d4-a716-446655440020';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        CreateMessageUseCase,
        FindMessageByIdUseCase,
        FindMessagesByConversationUseCase,
        EditMessageUseCase,
        DeleteMessageUseCase,
        RestoreMessageUseCase,
        {
          provide: CONVERSATION_REPOSITORY,
          useValue: new InMemoryConversationRepository(),
        },
        {
          provide: MESSAGE_REPOSITORY,
          useValue: new InMemoryMessageRepository(),
        },
        {
          provide: MESSAGE_VERSION_REPOSITORY,
          useValue: new InMemoryMessageVersionRepository(),
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    controller = moduleRef.get(MessageController);
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    const conversationRepository =
      moduleRef.get<ConversationRepository>(CONVERSATION_REPOSITORY);
    await conversationRepository.save(
      Conversation.reconstitute(
        conversationId,
        'user-1',
        'Conversa',
        false,
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-01T00:00:00.000Z'),
      ),
    );
  });

  afterEach(async () => {
    await app.close();
  });

  it('validates message payloads through ValidationPipe', async () => {
    await expect(
      validationPipe.transform(
        {
          conversationId: 'invalid-uuid',
          content: 'Mensagem',
        },
        {
          type: 'body',
          metatype: CreateMessageData,
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates, lists, edits, deletes and restores a message', async () => {
    const createBody = (await validationPipe.transform(
      {
        conversationId,
        content: 'Mensagem inicial',
      },
      {
        type: 'body',
        metatype: CreateMessageData,
      },
    )) as CreateMessageData;

    const createResponse = await controller.create(createBody);
    expect(createResponse).toMatchObject({
      success: true,
      message: {
        conversationId,
        content: 'Mensagem inicial',
      },
    });

    const messageId = createResponse.message.id;

    const listResponse = await controller.findByConversation(conversationId);
    expect(listResponse).toMatchObject({
      success: true,
      messages: [{ id: messageId }],
    });

    const editBody = (await validationPipe.transform(
      {
        content: 'Mensagem editada',
      },
      {
        type: 'body',
        metatype: EditMessageData,
      },
    )) as EditMessageData;

    const editResponse = await controller.edit(messageId, editBody);
    expect(editResponse).toMatchObject({
      success: true,
      message: {
        id: messageId,
        content: 'Mensagem editada',
      },
    });

    const findResponse = await controller.findOne(messageId);
    expect(findResponse).toMatchObject({
      success: true,
      message: {
        id: messageId,
        content: 'Mensagem editada',
      },
    });

    const deleteResponse = await controller.remove(messageId);
    expect(deleteResponse).toEqual({ success: true });

    const restoreResponse = await controller.restore(messageId);
    expect(restoreResponse).toEqual({ success: true });
  });
});
