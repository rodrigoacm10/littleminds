import { DeletePostSupportUseCase } from './delete-post-support.use-case';
import { PostSupport, type PostSupportRepository } from '../../../domain';

describe('DeletePostSupportUseCase', () => {
  const makePostSupportRepository = (): jest.Mocked<PostSupportRepository> => ({
    save: jest.fn(),
    findByUserAndPost: jest.fn(),
    findByPostId: jest.fn(),
    countByPostId: jest.fn(),
    existsByUserAndPost: jest.fn(),
    delete: jest.fn(),
  });

  it('returns SUPPORT_NOT_FOUND when support does not exist', async () => {
    const postSupportRepository = makePostSupportRepository();
    postSupportRepository.findByUserAndPost.mockResolvedValue(null);

    const sut = new DeletePostSupportUseCase(postSupportRepository);

    const result = await sut.execute({
      userId: 'user-1',
      postId: 'post-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'SUPPORT_NOT_FOUND',
    });
  });

  it('deletes the support when it exists', async () => {
    const postSupportRepository = makePostSupportRepository();
    const support = PostSupport.reconstitute(
      'support-1',
      'user-1',
      'post-1',
      new Date('2024-01-01T00:00:00.000Z'),
    );
    postSupportRepository.findByUserAndPost.mockResolvedValue(support);

    const sut = new DeletePostSupportUseCase(postSupportRepository);

    const result = await sut.execute({
      userId: 'user-1',
      postId: 'post-1',
    });

    expect(result).toEqual({ success: true });
    expect(postSupportRepository.delete).toHaveBeenCalledWith('support-1');
  });
});
