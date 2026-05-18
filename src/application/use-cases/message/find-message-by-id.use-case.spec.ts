import { FindMessageByIdUseCase } from './find-message-by-id.use-case';
import {
  Message,
  MessageRole,
  MessageVersion,
  type MessageRepository,
  type MessageVersionRepository,
} from '../../../domain';

describe('FindMessageByIdUseCase', () => {
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

  const makeMessage = () =>
    Message.reconstitute(
      'message-1',
      'conversation-1',
      MessageRole.USER,
      false,
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns MESSAGE_NOT_FOUND when message does not exist', async () => {
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    messageRepository.findById.mockResolvedValue(null);

    const sut = new FindMessageByIdUseCase(
      messageRepository,
      messageVersionRepository,
    );

    const result = await sut.execute({ id: 'message-1' });

    expect(result).toEqual({
      success: false,
      error: 'MESSAGE_NOT_FOUND',
    });
  });

  it('returns empty content when no version exists yet', async () => {
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    messageRepository.findById.mockResolvedValue(makeMessage());
    messageVersionRepository.findLatestByMessageId.mockResolvedValue(null);

    const sut = new FindMessageByIdUseCase(
      messageRepository,
      messageVersionRepository,
    );

    const result = await sut.execute({ id: 'message-1' });

    expect(result).toMatchObject({
      success: true,
      message: {
        id: 'message-1',
        content: '',
      },
    });
  });

  it('returns the message with latest version content', async () => {
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    messageRepository.findById.mockResolvedValue(makeMessage());
    messageVersionRepository.findLatestByMessageId.mockResolvedValue(
      MessageVersion.reconstitute(
        'version-1',
        'message-1',
        'Conteúdo atual',
        'user',
        new Date('2024-01-01T00:01:00.000Z'),
      ),
    );

    const sut = new FindMessageByIdUseCase(
      messageRepository,
      messageVersionRepository,
    );

    const result = await sut.execute({ id: 'message-1' });

    expect(result).toMatchObject({
      success: true,
      message: {
        id: 'message-1',
        conversationId: 'conversation-1',
        role: MessageRole.USER,
        content: 'Conteúdo atual',
      },
    });
  });
});
