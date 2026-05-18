import { FindConversationByIdUseCase } from './find-conversation-by-id.use-case';
import {
  Conversation,
  Message,
  MessageRole,
  MessageVersion,
  type ConversationRepository,
  type MessageRepository,
  type MessageVersionRepository,
} from '../../../domain';

describe('FindConversationByIdUseCase', () => {
  const makeConversationRepository = (): jest.Mocked<ConversationRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findActiveByUserId: jest.fn(),
    findArchivedByUserId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

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

  const makeConversation = () =>
    Conversation.reconstitute(
      'conversation-1',
      'user-1',
      'Minha conversa',
      false,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

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

  it('returns CONVERSATION_NOT_FOUND when conversation does not exist', async () => {
    const conversationRepository = makeConversationRepository();
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    conversationRepository.findById.mockResolvedValue(null);

    const sut = new FindConversationByIdUseCase(
      conversationRepository,
      messageRepository,
      messageVersionRepository,
    );

    const result = await sut.execute({ id: 'conversation-1' });

    expect(result).toEqual({
      success: false,
      error: 'CONVERSATION_NOT_FOUND',
    });
  });

  it('returns conversation with active messages sorted by creation time', async () => {
    const conversationRepository = makeConversationRepository();
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    conversationRepository.findById.mockResolvedValue(makeConversation());
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

    const sut = new FindConversationByIdUseCase(
      conversationRepository,
      messageRepository,
      messageVersionRepository,
    );

    const result = await sut.execute({ id: 'conversation-1' });

    expect(result).toMatchObject({
      success: true,
      conversation: {
        id: 'conversation-1',
        userId: 'user-1',
        messages: [
          {
            id: 'message-1',
            content: 'conteudo-message-1',
          },
          {
            id: 'message-2',
            content: 'conteudo-message-2',
          },
        ],
      },
    });
  });
});
