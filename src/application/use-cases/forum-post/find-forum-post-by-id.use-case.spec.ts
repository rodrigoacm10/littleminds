import { FindForumPostByIdUseCase } from './find-forum-post-by-id.use-case';
import { AgeGroup, ForumPost, type ForumPostRepository } from '../../../domain';

describe('FindForumPostByIdUseCase', () => {
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
      'Rotina de sono',
      'Meu filho está acordando muito.',
      'user-1',
      AgeGroup.BABY,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns POST_NOT_FOUND when post does not exist', async () => {
    const forumPostRepository = makeForumPostRepository();
    forumPostRepository.findById.mockResolvedValue(null);

    const sut = new FindForumPostByIdUseCase(forumPostRepository);

    const result = await sut.execute({ id: 'post-1' });

    expect(result).toEqual({
      success: false,
      error: 'POST_NOT_FOUND',
    });
  });

  it('returns the forum post when it exists', async () => {
    const forumPostRepository = makeForumPostRepository();
    forumPostRepository.findById.mockResolvedValue(makePost());

    const sut = new FindForumPostByIdUseCase(forumPostRepository);

    const result = await sut.execute({ id: 'post-1' });

    expect(result).toMatchObject({
      success: true,
      post: {
        id: 'post-1',
        title: 'Rotina de sono',
        authorId: 'user-1',
        ageGroup: AgeGroup.BABY,
      },
    });
  });
});
