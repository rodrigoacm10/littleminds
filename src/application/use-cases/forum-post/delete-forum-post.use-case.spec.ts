import { DeleteForumPostUseCase } from './delete-forum-post.use-case';
import { ForumPost, type ForumPostRepository } from '../../../domain';

describe('DeleteForumPostUseCase', () => {
  const makeForumPostRepository = (): jest.Mocked<ForumPostRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByAuthorId: jest.fn(),
    findByAgeGroup: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makePost = () =>
    ForumPost.reconstitute(
      'post-1',
      'Título',
      'Conteúdo',
      'user-1',
      null,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns POST_NOT_FOUND when post does not exist', async () => {
    const forumPostRepository = makeForumPostRepository();
    forumPostRepository.findById.mockResolvedValue(null);

    const sut = new DeleteForumPostUseCase(forumPostRepository);

    const result = await sut.execute({
      id: 'post-1',
      requesterId: 'user-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'POST_NOT_FOUND',
    });
  });

  it('returns NOT_AUTHORIZED when requester is not the author', async () => {
    const forumPostRepository = makeForumPostRepository();
    forumPostRepository.findById.mockResolvedValue(makePost());

    const sut = new DeleteForumPostUseCase(forumPostRepository);

    const result = await sut.execute({
      id: 'post-1',
      requesterId: 'other-user',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
  });

  it('deletes the post when requester is the author', async () => {
    const forumPostRepository = makeForumPostRepository();
    forumPostRepository.findById.mockResolvedValue(makePost());

    const sut = new DeleteForumPostUseCase(forumPostRepository);

    const result = await sut.execute({
      id: 'post-1',
      requesterId: 'user-1',
    });

    expect(result).toEqual({ success: true });
    expect(forumPostRepository.delete).toHaveBeenCalledWith('post-1');
  });
});
