import { CheckUserSupportUseCase } from './check-user-support.use-case';
import { type PostSupportRepository } from '../../../domain';

describe('CheckUserSupportUseCase', () => {
  const makePostSupportRepository = (): jest.Mocked<PostSupportRepository> => ({
    save: jest.fn(),
    findByUserAndPost: jest.fn(),
    findByPostId: jest.fn(),
    countByPostId: jest.fn(),
    existsByUserAndPost: jest.fn(),
    delete: jest.fn(),
  });

  it('returns whether the user supported the post and the total support count', async () => {
    const postSupportRepository = makePostSupportRepository();
    postSupportRepository.existsByUserAndPost.mockResolvedValue(true);
    postSupportRepository.countByPostId.mockResolvedValue(3);

    const sut = new CheckUserSupportUseCase(postSupportRepository);

    const result = await sut.execute({
      userId: 'user-1',
      postId: 'post-1',
    });

    expect(result).toEqual({
      success: true,
      hasSupported: true,
      totalSupports: 3,
    });
    expect(postSupportRepository.existsByUserAndPost).toHaveBeenCalledWith(
      'user-1',
      'post-1',
    );
    expect(postSupportRepository.countByPostId).toHaveBeenCalledWith('post-1');
  });
});
