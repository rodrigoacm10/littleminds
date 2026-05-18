import { CreatePostSupportUseCase } from './create-post-support.use-case';
import { AgeGroup, ForumPost, PostSupport, Role, User, type ForumPostRepository, type PostSupportRepository, type UserRepository } from '../../../domain';

describe('CreatePostSupportUseCase', () => {
  const makePostSupportRepository = (): jest.Mocked<PostSupportRepository> => ({
    save: jest.fn(),
    findByUserAndPost: jest.fn(),
    findByPostId: jest.fn(),
    countByPostId: jest.fn(),
    existsByUserAndPost: jest.fn(),
    delete: jest.fn(),
  });

  const makeForumPostRepository = (): jest.Mocked<ForumPostRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByAuthorId: jest.fn(),
    findByAgeGroup: jest.fn(),
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
      'Pedro',
      'pedro@example.com',
      'hashed-password',
      Role.PARENT,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  const makePost = () =>
    ForumPost.reconstitute(
      'post-1',
      'Titulo',
      'Conteudo',
      'author-1',
      AgeGroup.CHILD,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns USER_NOT_FOUND when supporter does not exist', async () => {
    const postSupportRepository = makePostSupportRepository();
    const forumPostRepository = makeForumPostRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(null);

    const sut = new CreatePostSupportUseCase(
      postSupportRepository,
      forumPostRepository,
      userRepository,
    );

    const result = await sut.execute({
      userId: 'user-1',
      postId: 'post-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'USER_NOT_FOUND',
    });
  });

  it('returns ALREADY_SUPPORTED when the same user already supported the post', async () => {
    const postSupportRepository = makePostSupportRepository();
    const forumPostRepository = makeForumPostRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(makeUser());
    forumPostRepository.findById.mockResolvedValue(makePost());
    postSupportRepository.existsByUserAndPost.mockResolvedValue(true);

    const sut = new CreatePostSupportUseCase(
      postSupportRepository,
      forumPostRepository,
      userRepository,
    );

    const result = await sut.execute({
      userId: 'user-1',
      postId: 'post-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'ALREADY_SUPPORTED',
    });
    expect(postSupportRepository.save).not.toHaveBeenCalled();
  });

  it('creates and persists a support when data is valid', async () => {
    const postSupportRepository = makePostSupportRepository();
    const forumPostRepository = makeForumPostRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(makeUser());
    forumPostRepository.findById.mockResolvedValue(makePost());
    postSupportRepository.existsByUserAndPost.mockResolvedValue(false);

    const sut = new CreatePostSupportUseCase(
      postSupportRepository,
      forumPostRepository,
      userRepository,
    );

    const result = await sut.execute({
      userId: 'user-1',
      postId: 'post-1',
    });

    expect(result).toMatchObject({
      success: true,
      support: {
        userId: 'user-1',
        postId: 'post-1',
      },
    });
    expect(postSupportRepository.save).toHaveBeenCalledTimes(1);
    expect(postSupportRepository.save.mock.calls[0][0]).toBeInstanceOf(PostSupport);
  });
});
