import { CreateMessageUseCase } from './create-message.use-case';
import {
  Conversation,
  Message,
  MessageRole,
  MessageVersion,
  type ConversationRepository,
  type MessageRepository,
  type MessageVersionRepository,
} from '../../../domain';

describe('CreateMessageUseCase', () => {
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
      'Chat',
      false,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns CONVERSATION_NOT_FOUND when conversation does not exist', async () => {
    const conversationRepository = makeConversationRepository();
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    conversationRepository.findById.mockResolvedValue(null);

    const sut = new CreateMessageUseCase(
      messageRepository,
      messageVersionRepository,
      conversationRepository,
    );

    const result = await sut.execute({
      conversationId: 'conversation-1',
      role: MessageRole.USER,
      content: 'Olá',
    });

    expect(result).toEqual({
      success: false,
      error: 'CONVERSATION_NOT_FOUND',
    });
  });

  it('returns INVALID_CONTENT when content is blank', async () => {
    const conversationRepository = makeConversationRepository();
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    conversationRepository.findById.mockResolvedValue(makeConversation());

    const sut = new CreateMessageUseCase(
      messageRepository,
      messageVersionRepository,
      conversationRepository,
    );

    const result = await sut.execute({
      conversationId: 'conversation-1',
      role: MessageRole.USER,
      content: '   ',
    });

    expect(result).toEqual({
      success: false,
      error: 'INVALID_CONTENT',
    });
    expect(messageRepository.save).not.toHaveBeenCalled();
  });

  it('creates and persists message plus first version', async () => {
    const conversationRepository = makeConversationRepository();
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    conversationRepository.findById.mockResolvedValue(makeConversation());

    const sut = new CreateMessageUseCase(
      messageRepository,
      messageVersionRepository,
      conversationRepository,
    );

    const result = await sut.execute({
      conversationId: 'conversation-1',
      role: MessageRole.ASSISTANT,
      content: ' Resposta da IA ',
      editedBy: 'system',
    });

    expect(result).toMatchObject({
      success: true,
      message: {
        conversationId: 'conversation-1',
        role: MessageRole.ASSISTANT,
        content: 'Resposta da IA',
        isDeleted: false,
      },
    });
    expect(messageRepository.save).toHaveBeenCalledTimes(1);
    expect(messageVersionRepository.save).toHaveBeenCalledTimes(1);
    expect(messageRepository.save.mock.calls[0][0]).toBeInstanceOf(Message);
    expect(messageVersionRepository.save.mock.calls[0][0]).toBeInstanceOf(
      MessageVersion,
    );
  });
});
