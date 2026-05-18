import { CreateForumPostUseCase } from './create-forum-post.use-case';
import {
  AgeGroup,
  ForumPost,
  Role,
  User,
  type ForumPostRepository,
  type UserRepository,
} from '../../../domain';

describe('CreateForumPostUseCase', () => {
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

  const makeAuthor = () =>
    User.reconstitute(
      'user-1',
      'Maria',
      'maria@example.com',
      'hashed-password',
      Role.PARENT,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns AUTHOR_NOT_FOUND when author does not exist', async () => {
    const forumPostRepository = makeForumPostRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(null);

    const sut = new CreateForumPostUseCase(forumPostRepository, userRepository);

    const result = await sut.execute({
      authorId: 'user-1',
      title: 'Post',
      content: 'Content',
    });

    expect(result).toEqual({
      success: false,
      error: 'AUTHOR_NOT_FOUND',
    });
  });

  it('returns INVALID_DATA when entity creation fails', async () => {
    const forumPostRepository = makeForumPostRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(makeAuthor());

    const sut = new CreateForumPostUseCase(forumPostRepository, userRepository);

    const result = await sut.execute({
      authorId: 'user-1',
      title: '   ',
      content: 'Content',
    });

    expect(result).toEqual({
      success: false,
      error: 'INVALID_DATA',
    });
    expect(forumPostRepository.save).not.toHaveBeenCalled();
  });

  it('creates and saves a forum post for a valid author', async () => {
    const forumPostRepository = makeForumPostRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(makeAuthor());

    const sut = new CreateForumPostUseCase(forumPostRepository, userRepository);

    const result = await sut.execute({
      authorId: 'user-1',
      title: ' Rotina de sono ',
      content: ' Meu filho está acordando muito. ',
      ageGroup: AgeGroup.BABY,
    });

    expect(result).toMatchObject({
      success: true,
      post: {
        title: 'Rotina de sono',
        content: 'Meu filho está acordando muito.',
        authorId: 'user-1',
        ageGroup: AgeGroup.BABY,
      },
    });
    expect(forumPostRepository.save).toHaveBeenCalledTimes(1);
    expect(forumPostRepository.save.mock.calls[0][0]).toBeInstanceOf(ForumPost);
  });
});
