import { FindAllForumPostsUseCase } from './find-all-forum-posts.use-case';
import { AgeGroup, ForumPost, type ForumPostRepository } from '../../../domain';

describe('FindAllForumPostsUseCase', () => {
  const makeForumPostRepository = (): jest.Mocked<ForumPostRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByAuthorId: jest.fn(),
    findByAgeGroup: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makePost = (id: string, authorId: string, ageGroup: AgeGroup | null) =>
    ForumPost.reconstitute(
      id,
      `Título ${id}`,
      `Conteúdo ${id}`,
      authorId,
      ageGroup,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('lists all posts when no filter is provided', async () => {
    const forumPostRepository = makeForumPostRepository();
    forumPostRepository.findAll.mockResolvedValue([
      makePost('post-1', 'user-1', AgeGroup.BABY),
      makePost('post-2', 'user-2', AgeGroup.CHILD),
    ]);

    const sut = new FindAllForumPostsUseCase(forumPostRepository);

    const result = await sut.execute();

    expect(result).toMatchObject({
      success: true,
      posts: [
        { id: 'post-1', authorId: 'user-1' },
        { id: 'post-2', authorId: 'user-2' },
      ],
    });
    expect(forumPostRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('filters posts by authorId when provided', async () => {
    const forumPostRepository = makeForumPostRepository();
    forumPostRepository.findByAuthorId.mockResolvedValue([
      makePost('post-1', 'user-1', AgeGroup.BABY),
    ]);

    const sut = new FindAllForumPostsUseCase(forumPostRepository);

    const result = await sut.execute({ authorId: 'user-1' });

    expect(result).toMatchObject({
      success: true,
      posts: [{ id: 'post-1', authorId: 'user-1' }],
    });
    expect(forumPostRepository.findByAuthorId).toHaveBeenCalledWith('user-1');
  });

  it('filters posts by age group when provided', async () => {
    const forumPostRepository = makeForumPostRepository();
    forumPostRepository.findByAgeGroup.mockResolvedValue([
      makePost('post-2', 'user-2', AgeGroup.CHILD),
    ]);

    const sut = new FindAllForumPostsUseCase(forumPostRepository);

    const result = await sut.execute({ ageGroup: AgeGroup.CHILD });

    expect(result).toMatchObject({
      success: true,
      posts: [{ id: 'post-2', ageGroup: AgeGroup.CHILD }],
    });
    expect(forumPostRepository.findByAgeGroup).toHaveBeenCalledWith(
      AgeGroup.CHILD,
    );
  });
});
