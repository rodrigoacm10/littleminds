import { FindAllConversationsUseCase } from './find-all-conversations.use-case';
import { Conversation, type ConversationRepository } from '../../../domain';

describe('FindAllConversationsUseCase', () => {
  const makeConversationRepository = (): jest.Mocked<ConversationRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findActiveByUserId: jest.fn(),
    findArchivedByUserId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeConversation = (
    id: string,
    userId: string,
    isArchived: boolean,
  ) =>
    Conversation.reconstitute(
      id,
      userId,
      `Conversa ${id}`,
      isArchived,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('lists all user conversations when no filter is provided', async () => {
    const conversationRepository = makeConversationRepository();
    conversationRepository.findByUserId.mockResolvedValue([
      makeConversation('conversation-1', 'user-1', false),
      makeConversation('conversation-2', 'user-1', true),
    ]);

    const sut = new FindAllConversationsUseCase(conversationRepository);

    const result = await sut.execute({ userId: 'user-1' });

    expect(result).toMatchObject({
      success: true,
      conversations: [
        { id: 'conversation-1', userId: 'user-1', isArchived: false },
        { id: 'conversation-2', userId: 'user-1', isArchived: true },
      ],
    });
    expect(conversationRepository.findByUserId).toHaveBeenCalledWith('user-1');
  });

  it('lists only archived conversations when archivedOnly is true', async () => {
    const conversationRepository = makeConversationRepository();
    conversationRepository.findArchivedByUserId.mockResolvedValue([
      makeConversation('conversation-2', 'user-1', true),
    ]);

    const sut = new FindAllConversationsUseCase(conversationRepository);

    const result = await sut.execute({
      userId: 'user-1',
      archivedOnly: true,
    });

    expect(result).toMatchObject({
      success: true,
      conversations: [{ id: 'conversation-2', isArchived: true }],
    });
    expect(conversationRepository.findArchivedByUserId).toHaveBeenCalledWith(
      'user-1',
    );
  });

  it('lists only active conversations when activeOnly is true', async () => {
    const conversationRepository = makeConversationRepository();
    conversationRepository.findActiveByUserId.mockResolvedValue([
      makeConversation('conversation-1', 'user-1', false),
    ]);

    const sut = new FindAllConversationsUseCase(conversationRepository);

    const result = await sut.execute({
      userId: 'user-1',
      activeOnly: true,
    });

    expect(result).toMatchObject({
      success: true,
      conversations: [{ id: 'conversation-1', isArchived: false }],
    });
    expect(conversationRepository.findActiveByUserId).toHaveBeenCalledWith(
      'user-1',
    );
  });
});
