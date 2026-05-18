import { FindCurrentMessageContentUseCase } from './find-current-message-content.use-case';
import {
  Message,
  MessageRole,
  MessageVersion,
  type MessageRepository,
  type MessageVersionRepository,
} from '../../../domain';

describe('FindCurrentMessageContentUseCase', () => {
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
    const messageVersionRepository = makeMessageVersionRepository();
    const messageRepository = makeMessageRepository();
    messageRepository.findById.mockResolvedValue(null);

    const sut = new FindCurrentMessageContentUseCase(
      messageVersionRepository,
      messageRepository,
    );

    const result = await sut.execute({ messageId: 'message-1' });

    expect(result).toEqual({
      success: false,
      error: 'MESSAGE_NOT_FOUND',
    });
  });

  it('returns NO_VERSIONS_FOUND when message has no version yet', async () => {
    const messageVersionRepository = makeMessageVersionRepository();
    const messageRepository = makeMessageRepository();
    messageRepository.findById.mockResolvedValue(makeMessage());
    messageVersionRepository.findLatestByMessageId.mockResolvedValue(null);

    const sut = new FindCurrentMessageContentUseCase(
      messageVersionRepository,
      messageRepository,
    );

    const result = await sut.execute({ messageId: 'message-1' });

    expect(result).toEqual({
      success: false,
      error: 'NO_VERSIONS_FOUND',
    });
  });

  it('returns current content and latest version when it exists', async () => {
    const messageVersionRepository = makeMessageVersionRepository();
    const messageRepository = makeMessageRepository();
    messageRepository.findById.mockResolvedValue(makeMessage());
    messageVersionRepository.findLatestByMessageId.mockResolvedValue(
      MessageVersion.reconstitute(
        'version-2',
        'message-1',
        'Texto atual',
        'system',
        new Date('2024-01-01T00:02:00.000Z'),
      ),
    );

    const sut = new FindCurrentMessageContentUseCase(
      messageVersionRepository,
      messageRepository,
    );

    const result = await sut.execute({ messageId: 'message-1' });

    expect(result).toMatchObject({
      success: true,
      content: 'Texto atual',
      version: {
        id: 'version-2',
        messageId: 'message-1',
      },
    });
  });
});
