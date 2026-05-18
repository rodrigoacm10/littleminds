import { FindPostSupportsByPostUseCase } from './find-post-supports-by-post.use-case';
import { PostSupport, type PostSupportRepository } from '../../../domain';

describe('FindPostSupportsByPostUseCase', () => {
  const makePostSupportRepository = (): jest.Mocked<PostSupportRepository> => ({
    save: jest.fn(),
    findByUserAndPost: jest.fn(),
    findByPostId: jest.fn(),
    countByPostId: jest.fn(),
    existsByUserAndPost: jest.fn(),
    delete: jest.fn(),
  });

  it('returns all supports for the post and the total count', async () => {
    const postSupportRepository = makePostSupportRepository();
    postSupportRepository.findByPostId.mockResolvedValue([
      PostSupport.reconstitute(
        'support-1',
        'user-1',
        'post-1',
        new Date('2024-01-01T00:00:00.000Z'),
      ),
      PostSupport.reconstitute(
        'support-2',
        'user-2',
        'post-1',
        new Date('2024-01-01T00:01:00.000Z'),
      ),
    ]);

    const sut = new FindPostSupportsByPostUseCase(postSupportRepository);

    const result = await sut.execute({ postId: 'post-1' });

    expect(result).toMatchObject({
      success: true,
      total: 2,
      supports: [
        { id: 'support-1', userId: 'user-1', postId: 'post-1' },
        { id: 'support-2', userId: 'user-2', postId: 'post-1' },
      ],
    });
  });
});
