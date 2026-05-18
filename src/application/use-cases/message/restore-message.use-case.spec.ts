import { RestoreMessageUseCase } from './restore-message.use-case';
import { Message, MessageRole, type MessageRepository } from '../../../domain';

describe('RestoreMessageUseCase', () => {
  const makeMessageRepository = (): jest.Mocked<MessageRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByConversationId: jest.fn(),
    findByConversationIdAndRole: jest.fn(),
    findLastByConversationId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeMessage = (deleted = true) =>
    Message.reconstitute(
      'message-1',
      'conversation-1',
      MessageRole.USER,
      deleted,
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns MESSAGE_NOT_FOUND when message does not exist', async () => {
    const messageRepository = makeMessageRepository();
    messageRepository.findById.mockResolvedValue(null);

    const sut = new RestoreMessageUseCase(messageRepository);

    const result = await sut.execute({ id: 'message-1' });

    expect(result).toEqual({
      success: false,
      error: 'MESSAGE_NOT_FOUND',
    });
  });

  it('returns NOT_DELETED when message is already active', async () => {
    const messageRepository = makeMessageRepository();
    messageRepository.findById.mockResolvedValue(makeMessage(false));

    const sut = new RestoreMessageUseCase(messageRepository);

    const result = await sut.execute({ id: 'message-1' });

    expect(result).toEqual({
      success: false,
      error: 'NOT_DELETED',
    });
  });

  it('restores the message and persists it', async () => {
    const messageRepository = makeMessageRepository();
    const message = makeMessage(true);
    messageRepository.findById.mockResolvedValue(message);

    const sut = new RestoreMessageUseCase(messageRepository);

    const result = await sut.execute({ id: 'message-1' });

    expect(result).toEqual({ success: true });
    expect(message.isDeleted).toBe(false);
    expect(messageRepository.save).toHaveBeenCalledWith(message);
  });
});
