import { FindMessageHistoryUseCase } from './find-message-history.use-case';
import {
  Message,
  MessageRole,
  MessageVersion,
  type MessageRepository,
  type MessageVersionRepository,
} from '../../../domain';

describe('FindMessageHistoryUseCase', () => {
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

    const sut = new FindMessageHistoryUseCase(
      messageVersionRepository,
      messageRepository,
    );

    const result = await sut.execute({ messageId: 'message-1' });

    expect(result).toEqual({
      success: false,
      error: 'MESSAGE_NOT_FOUND',
    });
  });

  it('returns message history sorted by creation date', async () => {
    const messageVersionRepository = makeMessageVersionRepository();
    const messageRepository = makeMessageRepository();
    messageRepository.findById.mockResolvedValue(makeMessage());
    messageVersionRepository.findByMessageId.mockResolvedValue([
      MessageVersion.reconstitute(
        'version-2',
        'message-1',
        'Texto 2',
        'system',
        new Date('2024-01-01T00:01:00.000Z'),
      ),
      MessageVersion.reconstitute(
        'version-1',
        'message-1',
        'Texto 1',
        'user',
        new Date('2024-01-01T00:00:00.000Z'),
      ),
    ]);

    const sut = new FindMessageHistoryUseCase(
      messageVersionRepository,
      messageRepository,
    );

    const result = await sut.execute({ messageId: 'message-1' });

    expect(result).toEqual({
      success: true,
      versions: [
        expect.objectContaining({ id: 'version-1', content: 'Texto 1' }),
        expect.objectContaining({ id: 'version-2', content: 'Texto 2' }),
      ],
    });
  });
});
