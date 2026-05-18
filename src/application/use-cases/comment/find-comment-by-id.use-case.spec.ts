import { FindCommentByIdUseCase } from './find-comment-by-id.use-case';
import { Comment, type CommentRepository } from '../../../domain';

describe('FindCommentByIdUseCase', () => {
  const makeCommentRepository = (): jest.Mocked<CommentRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByPostId: jest.fn(),
    findByAuthorId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeComment = () =>
    Comment.reconstitute(
      'comment-1',
      'Comentário útil',
      'post-1',
      'user-1',
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns COMMENT_NOT_FOUND when comment does not exist', async () => {
    const commentRepository = makeCommentRepository();
    commentRepository.findById.mockResolvedValue(null);

    const sut = new FindCommentByIdUseCase(commentRepository);

    const result = await sut.execute({ id: 'comment-1' });

    expect(result).toEqual({
      success: false,
      error: 'COMMENT_NOT_FOUND',
    });
  });

  it('returns the comment when it exists', async () => {
    const commentRepository = makeCommentRepository();
    commentRepository.findById.mockResolvedValue(makeComment());

    const sut = new FindCommentByIdUseCase(commentRepository);

    const result = await sut.execute({ id: 'comment-1' });

    expect(result).toMatchObject({
      success: true,
      comment: {
        id: 'comment-1',
        postId: 'post-1',
        authorId: 'user-1',
        content: 'Comentário útil',
      },
    });
  });
});
