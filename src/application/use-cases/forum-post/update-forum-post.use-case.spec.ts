import { UpdateForumPostUseCase } from './update-forum-post.use-case';
import { AgeGroup, ForumPost, type ForumPostRepository } from '../../../domain';

describe('UpdateForumPostUseCase', () => {
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
      'Título antigo',
      'Conteúdo antigo',
      'user-1',
      AgeGroup.BABY,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns POST_NOT_FOUND when post does not exist', async () => {
    const forumPostRepository = makeForumPostRepository();
    forumPostRepository.findById.mockResolvedValue(null);

    const sut = new UpdateForumPostUseCase(forumPostRepository);

    const result = await sut.execute({
      id: 'post-1',
      requesterId: 'user-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'POST_NOT_FOUND',
    });
  });

  it('returns NOT_AUTHORIZED when requester is not the post author', async () => {
    const forumPostRepository = makeForumPostRepository();
    forumPostRepository.findById.mockResolvedValue(makePost());

    const sut = new UpdateForumPostUseCase(forumPostRepository);

    const result = await sut.execute({
      id: 'post-1',
      requesterId: 'other-user',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
  });

  it('updates title, content and age group, then saves the post', async () => {
    const forumPostRepository = makeForumPostRepository();
    const post = makePost();
    forumPostRepository.findById.mockResolvedValue(post);

    const sut = new UpdateForumPostUseCase(forumPostRepository);

    const result = await sut.execute({
      id: 'post-1',
      requesterId: 'user-1',
      title: ' Novo título ',
      content: ' Novo conteúdo ',
      ageGroup: AgeGroup.CHILD,
    });

    expect(result).toMatchObject({
      success: true,
      post: {
        id: 'post-1',
        title: 'Novo título',
        content: 'Novo conteúdo',
        ageGroup: AgeGroup.CHILD,
      },
    });
    expect(forumPostRepository.save).toHaveBeenCalledWith(post);
  });

  it('clears age group when null is explicitly provided', async () => {
    const forumPostRepository = makeForumPostRepository();
    const post = makePost();
    forumPostRepository.findById.mockResolvedValue(post);

    const sut = new UpdateForumPostUseCase(forumPostRepository);

    const result = await sut.execute({
      id: 'post-1',
      requesterId: 'user-1',
      ageGroup: null,
    });

    expect(result).toMatchObject({
      success: true,
      post: {
        ageGroup: null,
      },
    });
  });
});
