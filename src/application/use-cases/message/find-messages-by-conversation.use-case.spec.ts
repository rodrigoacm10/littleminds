import { FindMessagesByConversationUseCase } from './find-messages-by-conversation.use-case';
import {
  Message,
  MessageRole,
  MessageVersion,
  type MessageRepository,
  type MessageVersionRepository,
} from '../../../domain';

describe('FindMessagesByConversationUseCase', () => {
  const makeMessageRepository = (): jest.Mocked<MessageRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByConversationId: jest.fn(),
    findByConversationIdAndRole: jest.fn(),
    findLastByConversationId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeMessageVersionRepository = (): jest.Mocked<MessageVersionRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByMessageId: jest.fn(),
    findLatestByMessageId: jest.fn(),
    delete: jest.fn(),
  });

  const makeMessage = (
    id: string,
    role: MessageRole,
    createdAt: string,
    isDeleted = false,
  ) =>
    Message.reconstitute(
      id,
      'conversation-1',
      role,
      isDeleted,
      new Date(createdAt),
    );

  it('returns active messages sorted by createdAt ascending by default', async () => {
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    messageRepository.findByConversationId.mockResolvedValue([
      makeMessage('message-2', MessageRole.ASSISTANT, '2024-01-01T00:00:02.000Z'),
      makeMessage('message-1', MessageRole.USER, '2024-01-01T00:00:01.000Z'),
      makeMessage('message-3', MessageRole.USER, '2024-01-01T00:00:03.000Z', true),
    ]);
    messageVersionRepository.findLatestByMessageId.mockImplementation(async (id) =>
      MessageVersion.reconstitute(
        `version-${id}`,
        id,
        `conteudo-${id}`,
        'user',
        new Date('2024-01-01T00:01:00.000Z'),
      ),
    );

    const sut = new FindMessagesByConversationUseCase(
      messageRepository,
      messageVersionRepository,
    );

    const result = await sut.execute({ conversationId: 'conversation-1' });

    expect(result).toEqual({
      success: true,
      messages: [
        expect.objectContaining({
          id: 'message-1',
          content: 'conteudo-message-1',
        }),
        expect.objectContaining({
          id: 'message-2',
          content: 'conteudo-message-2',
        }),
      ],
    });
  });

  it('includes deleted messages when includeDeleted is true', async () => {
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    messageRepository.findByConversationId.mockResolvedValue([
      makeMessage('message-1', MessageRole.USER, '2024-01-01T00:00:01.000Z', true),
    ]);
    messageVersionRepository.findLatestByMessageId.mockResolvedValue(
      MessageVersion.reconstitute(
        'version-1',
        'message-1',
        'conteudo-message-1',
        'user',
        new Date('2024-01-01T00:01:00.000Z'),
      ),
    );

    const sut = new FindMessagesByConversationUseCase(
      messageRepository,
      messageVersionRepository,
    );

    const result = await sut.execute({
      conversationId: 'conversation-1',
      includeDeleted: true,
    });

    expect(result).toMatchObject({
      success: true,
      messages: [
        {
          id: 'message-1',
          isDeleted: true,
          content: 'conteudo-message-1',
        },
      ],
    });
  });
});
