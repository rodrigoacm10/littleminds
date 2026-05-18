import { UpdateCommentUseCase } from './update-comment.use-case';
import { Comment, type CommentRepository } from '../../../domain';

describe('UpdateCommentUseCase', () => {
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
      'Comentário antigo',
      'post-1',
      'user-1',
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns COMMENT_NOT_FOUND when comment does not exist', async () => {
    const commentRepository = makeCommentRepository();
    commentRepository.findById.mockResolvedValue(null);

    const sut = new UpdateCommentUseCase(commentRepository);

    const result = await sut.execute({
      id: 'comment-1',
      requesterId: 'user-1',
      content: 'Novo conteúdo',
    });

    expect(result).toEqual({
      success: false,
      error: 'COMMENT_NOT_FOUND',
    });
  });

  it('returns NOT_AUTHORIZED when requester is not the author', async () => {
    const commentRepository = makeCommentRepository();
    commentRepository.findById.mockResolvedValue(makeComment());

    const sut = new UpdateCommentUseCase(commentRepository);

    const result = await sut.execute({
      id: 'comment-1',
      requesterId: 'other-user',
      content: 'Novo conteúdo',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
  });

  it('updates and saves the comment for the author', async () => {
    const commentRepository = makeCommentRepository();
    const comment = makeComment();
    commentRepository.findById.mockResolvedValue(comment);

    const sut = new UpdateCommentUseCase(commentRepository);

    const result = await sut.execute({
      id: 'comment-1',
      requesterId: 'user-1',
      content: ' Conteúdo atualizado ',
    });

    expect(result).toMatchObject({
      success: true,
      comment: {
        id: 'comment-1',
        content: 'Conteúdo atualizado',
        authorId: 'user-1',
      },
    });
    expect(commentRepository.save).toHaveBeenCalledWith(comment);
  });
});
