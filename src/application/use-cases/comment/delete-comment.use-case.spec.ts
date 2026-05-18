import { DeleteCommentUseCase } from './delete-comment.use-case';
import { Comment, type CommentRepository } from '../../../domain';

describe('DeleteCommentUseCase', () => {
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
      'Comentário',
      'post-1',
      'user-1',
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns COMMENT_NOT_FOUND when comment does not exist', async () => {
    const commentRepository = makeCommentRepository();
    commentRepository.findById.mockResolvedValue(null);

    const sut = new DeleteCommentUseCase(commentRepository);

    const result = await sut.execute({
      id: 'comment-1',
      requesterId: 'user-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'COMMENT_NOT_FOUND',
    });
  });

  it('returns NOT_AUTHORIZED when requester is not the author', async () => {
    const commentRepository = makeCommentRepository();
    commentRepository.findById.mockResolvedValue(makeComment());

    const sut = new DeleteCommentUseCase(commentRepository);

    const result = await sut.execute({
      id: 'comment-1',
      requesterId: 'other-user',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
  });

  it('deletes the comment when requester is the author', async () => {
    const commentRepository = makeCommentRepository();
    commentRepository.findById.mockResolvedValue(makeComment());

    const sut = new DeleteCommentUseCase(commentRepository);

    const result = await sut.execute({
      id: 'comment-1',
      requesterId: 'user-1',
    });

    expect(result).toEqual({ success: true });
    expect(commentRepository.delete).toHaveBeenCalledWith('comment-1');
  });
});
