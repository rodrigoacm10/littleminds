import { DeleteConversationUseCase } from './delete-conversation.use-case';
import { Conversation, type ConversationRepository } from '../../../domain';

describe('DeleteConversationUseCase', () => {
  const makeConversationRepository = (): jest.Mocked<ConversationRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findActiveByUserId: jest.fn(),
    findArchivedByUserId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
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

  it('returns CONVERSATION_NOT_FOUND when conversation does not exist', async () => {
    const conversationRepository = makeConversationRepository();
    conversationRepository.findById.mockResolvedValue(null);

    const sut = new DeleteConversationUseCase(conversationRepository);

    const result = await sut.execute({
      id: 'conversation-1',
      requesterId: 'user-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'CONVERSATION_NOT_FOUND',
    });
  });

  it('returns NOT_AUTHORIZED when requester is not the owner', async () => {
    const conversationRepository = makeConversationRepository();
    conversationRepository.findById.mockResolvedValue(makeConversation());

    const sut = new DeleteConversationUseCase(conversationRepository);

    const result = await sut.execute({
      id: 'conversation-1',
      requesterId: 'other-user',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
  });

  it('deletes the conversation when requester is the owner', async () => {
    const conversationRepository = makeConversationRepository();
    conversationRepository.findById.mockResolvedValue(makeConversation());

    const sut = new DeleteConversationUseCase(conversationRepository);

    const result = await sut.execute({
      id: 'conversation-1',
      requesterId: 'user-1',
    });

    expect(result).toEqual({ success: true });
    expect(conversationRepository.delete).toHaveBeenCalledWith('conversation-1');
  });
});
