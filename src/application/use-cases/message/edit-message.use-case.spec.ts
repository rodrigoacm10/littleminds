import { EditMessageUseCase } from './edit-message.use-case';
import { Message, MessageRole, MessageVersion, type MessageRepository, type MessageVersionRepository } from '../../../domain';

describe('EditMessageUseCase', () => {
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
    const messageVersionRepository = makeMessageVersionRepository();
    messageRepository.findById.mockResolvedValue(null);

    const sut = new EditMessageUseCase(messageRepository, messageVersionRepository);

    const result = await sut.execute({
      messageId: 'message-1',
      content: 'Novo conteudo',
    });

    expect(result).toEqual({
      success: false,
      error: 'MESSAGE_NOT_FOUND',
    });
  });

  it('returns MESSAGE_DELETED when message is soft deleted', async () => {
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    messageRepository.findById.mockResolvedValue(makeMessage(true));

    const sut = new EditMessageUseCase(messageRepository, messageVersionRepository);

    const result = await sut.execute({
      messageId: 'message-1',
      content: 'Novo conteudo',
    });

    expect(result).toEqual({
      success: false,
      error: 'MESSAGE_DELETED',
    });
  });

  it('returns INVALID_CONTENT when version creation fails', async () => {
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    messageRepository.findById.mockResolvedValue(makeMessage());

    const sut = new EditMessageUseCase(messageRepository, messageVersionRepository);

    const result = await sut.execute({
      messageId: 'message-1',
      content: '   ',
    });

    expect(result).toEqual({
      success: false,
      error: 'INVALID_CONTENT',
    });
    expect(messageVersionRepository.save).not.toHaveBeenCalled();
  });

  it('creates a new version preserving message identity', async () => {
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    messageRepository.findById.mockResolvedValue(makeMessage());

    const sut = new EditMessageUseCase(messageRepository, messageVersionRepository);

    const result = await sut.execute({
      messageId: 'message-1',
      content: ' Conteudo editado ',
      editedBy: 'system',
    });

    expect(result).toMatchObject({
      success: true,
      message: {
        id: 'message-1',
        conversationId: 'conversation-1',
        role: MessageRole.USER,
        content: 'Conteudo editado',
        isDeleted: false,
      },
    });
    expect(messageVersionRepository.save).toHaveBeenCalledTimes(1);
    expect(messageVersionRepository.save.mock.calls[0][0]).toBeInstanceOf(MessageVersion);
  });
});
