import { CreateConversationUseCase } from './create-conversation.use-case';
import { Conversation, Role, User, type ConversationRepository, type UserRepository } from '../../../domain';

describe('CreateConversationUseCase', () => {
  const makeConversationRepository = (): jest.Mocked<ConversationRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findActiveByUserId: jest.fn(),
    findArchivedByUserId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeUserRepository = (): jest.Mocked<UserRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    existsByEmail: jest.fn(),
    findAll: jest.fn(),
    findByRole: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeUser = () =>
    User.reconstitute(
      'user-1',
      'Carla',
      'carla@example.com',
      'hashed-password',
      Role.PARENT,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns USER_NOT_FOUND when owner does not exist', async () => {
    const conversationRepository = makeConversationRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(null);

    const sut = new CreateConversationUseCase(
      conversationRepository,
      userRepository,
    );

    const result = await sut.execute({
      userId: 'user-1',
      title: 'Minha conversa',
    });

    expect(result).toEqual({
      success: false,
      error: 'USER_NOT_FOUND',
    });
  });

  it('returns INVALID_DATA when title is blank', async () => {
    const conversationRepository = makeConversationRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(makeUser());

    const sut = new CreateConversationUseCase(
      conversationRepository,
      userRepository,
    );

    const result = await sut.execute({
      userId: 'user-1',
      title: '   ',
    });

    expect(result).toEqual({
      success: false,
      error: 'INVALID_DATA',
    });
    expect(conversationRepository.save).not.toHaveBeenCalled();
  });

  it('creates and saves a conversation for a valid user', async () => {
    const conversationRepository = makeConversationRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(makeUser());

    const sut = new CreateConversationUseCase(
      conversationRepository,
      userRepository,
    );

    const result = await sut.execute({
      userId: 'user-1',
      title: ' Dúvidas sobre sono ',
    });

    expect(result).toMatchObject({
      success: true,
      conversation: {
        userId: 'user-1',
        title: 'Dúvidas sobre sono',
        isArchived: false,
      },
    });
    expect(conversationRepository.save).toHaveBeenCalledTimes(1);
    expect(conversationRepository.save.mock.calls[0][0]).toBeInstanceOf(Conversation);
  });
});
