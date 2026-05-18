import { CreateCommentUseCase } from './create-comment.use-case';
import { AgeGroup, Comment, ForumPost, Role, User, type CommentRepository, type ForumPostRepository, type UserRepository } from '../../../domain';

describe('CreateCommentUseCase', () => {
  const makeCommentRepository = (): jest.Mocked<CommentRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByPostId: jest.fn(),
    findByAuthorId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
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
      'Joao',
      'joao@example.com',
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

  it('returns POST_NOT_FOUND when target post does not exist', async () => {
    const commentRepository = makeCommentRepository();
    const forumPostRepository = makeForumPostRepository();
    const userRepository = makeUserRepository();
    forumPostRepository.findById.mockResolvedValue(null);

    const sut = new CreateCommentUseCase(
      commentRepository,
      forumPostRepository,
      userRepository,
    );

    const result = await sut.execute({
      content: 'Comentario',
      postId: 'post-1',
      authorId: 'user-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'POST_NOT_FOUND',
    });
  });

  it('returns AUTHOR_NOT_FOUND when commenter does not exist', async () => {
    const commentRepository = makeCommentRepository();
    const forumPostRepository = makeForumPostRepository();
    const userRepository = makeUserRepository();
    forumPostRepository.findById.mockResolvedValue(makePost());
    userRepository.findById.mockResolvedValue(null);

    const sut = new CreateCommentUseCase(
      commentRepository,
      forumPostRepository,
      userRepository,
    );

    const result = await sut.execute({
      content: 'Comentario',
      postId: 'post-1',
      authorId: 'user-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'AUTHOR_NOT_FOUND',
    });
  });

  it('returns INVALID_DATA when content is blank', async () => {
    const commentRepository = makeCommentRepository();
    const forumPostRepository = makeForumPostRepository();
    const userRepository = makeUserRepository();
    forumPostRepository.findById.mockResolvedValue(makePost());
    userRepository.findById.mockResolvedValue(makeUser());

    const sut = new CreateCommentUseCase(
      commentRepository,
      forumPostRepository,
      userRepository,
    );

    const result = await sut.execute({
      content: '   ',
      postId: 'post-1',
      authorId: 'user-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'INVALID_DATA',
    });
  });

  it('creates and saves a valid comment', async () => {
    const commentRepository = makeCommentRepository();
    const forumPostRepository = makeForumPostRepository();
    const userRepository = makeUserRepository();
    forumPostRepository.findById.mockResolvedValue(makePost());
    userRepository.findById.mockResolvedValue(makeUser());

    const sut = new CreateCommentUseCase(
      commentRepository,
      forumPostRepository,
      userRepository,
    );

    const result = await sut.execute({
      content: ' Comentario com apoio ',
      postId: 'post-1',
      authorId: 'user-1',
    });

    expect(result).toMatchObject({
      success: true,
      comment: {
        postId: 'post-1',
        authorId: 'user-1',
        content: 'Comentario com apoio',
      },
    });
    expect(commentRepository.save).toHaveBeenCalledTimes(1);
    expect(commentRepository.save.mock.calls[0][0]).toBeInstanceOf(Comment);
  });
});
