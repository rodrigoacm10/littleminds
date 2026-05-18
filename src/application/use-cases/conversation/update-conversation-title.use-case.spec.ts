import { UpdateConversationTitleUseCase } from './update-conversation-title.use-case';
import { Conversation, type ConversationRepository } from '../../../domain';

describe('UpdateConversationTitleUseCase', () => {
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
      'Titulo antigo',
      false,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns CONVERSATION_NOT_FOUND when conversation does not exist', async () => {
    const conversationRepository = makeConversationRepository();
    conversationRepository.findById.mockResolvedValue(null);

    const sut = new UpdateConversationTitleUseCase(conversationRepository);

    const result = await sut.execute({
      id: 'conversation-1',
      requesterId: 'user-1',
      title: 'Novo título',
    });

    expect(result).toEqual({
      success: false,
      error: 'CONVERSATION_NOT_FOUND',
    });
  });

  it('returns NOT_AUTHORIZED when requester is not the owner', async () => {
    const conversationRepository = makeConversationRepository();
    conversationRepository.findById.mockResolvedValue(makeConversation());

    const sut = new UpdateConversationTitleUseCase(conversationRepository);

    const result = await sut.execute({
      id: 'conversation-1',
      requesterId: 'other-user',
      title: 'Novo título',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
  });

  it('updates the title and saves the conversation', async () => {
    const conversationRepository = makeConversationRepository();
    const conversation = makeConversation();
    conversationRepository.findById.mockResolvedValue(conversation);

    const sut = new UpdateConversationTitleUseCase(conversationRepository);

    const result = await sut.execute({
      id: 'conversation-1',
      requesterId: 'user-1',
      title: ' Novo título ',
    });

    expect(result).toMatchObject({
      success: true,
      conversation: {
        id: 'conversation-1',
        title: 'Novo título',
      },
    });
    expect(conversationRepository.save).toHaveBeenCalledWith(conversation);
  });
});
