import { DeleteMessageUseCase } from './delete-message.use-case';
import { Message, MessageRole, type MessageRepository } from '../../../domain';

describe('DeleteMessageUseCase', () => {
  const makeMessageRepository = (): jest.Mocked<MessageRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByConversationId: jest.fn(),
    findByConversationIdAndRole: jest.fn(),
    findLastByConversationId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeMessage = (deleted = false) =>
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

    const sut = new DeleteMessageUseCase(messageRepository);

    const result = await sut.execute({ id: 'message-1' });

    expect(result).toEqual({
      success: false,
      error: 'MESSAGE_NOT_FOUND',
    });
  });

  it('returns ALREADY_DELETED when message is already deleted', async () => {
    const messageRepository = makeMessageRepository();
    messageRepository.findById.mockResolvedValue(makeMessage(true));

    const sut = new DeleteMessageUseCase(messageRepository);

    const result = await sut.execute({ id: 'message-1' });

    expect(result).toEqual({
      success: false,
      error: 'ALREADY_DELETED',
    });
  });

  it('soft deletes the message and persists it', async () => {
    const messageRepository = makeMessageRepository();
    const message = makeMessage(false);
    messageRepository.findById.mockResolvedValue(message);

    const sut = new DeleteMessageUseCase(messageRepository);

    const result = await sut.execute({ id: 'message-1' });

    expect(result).toEqual({ success: true });
    expect(message.isDeleted).toBe(true);
    expect(messageRepository.save).toHaveBeenCalledWith(message);
  });
});
