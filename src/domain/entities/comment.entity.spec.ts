import { Comment } from './comment.entity';

describe('Comment', () => {
  it('creates a comment with trimmed content', () => {
    const comment = Comment.create(
      'comment-1',
      ' Comentário útil ',
      'post-1',
      'author-1',
    );

    expect(comment).not.toBeNull();
    expect(comment?.content).toBe('Comentário útil');
    expect(comment?.postId).toBe('post-1');
  });

  it('updates content and checks authorship', () => {
    const comment = Comment.create(
      'comment-1',
      'Comentário',
      'post-1',
      'author-1',
    ) as Comment;

    expect(comment.updateContent(' Conteúdo novo ')).toBe(true);
    expect(comment.content).toBe('Conteúdo novo');
    expect(comment.isAuthoredBy('author-1')).toBe(true);
    expect(comment.isAuthoredBy('other-user')).toBe(false);
  });

  it('rejects invalid creation and invalid content updates', () => {
    expect(Comment.create('', 'Comentário', 'post-1', 'author-1')).toBeNull();
    expect(Comment.create('comment-1', '   ', 'post-1', 'author-1')).toBeNull();

    const comment = Comment.create(
      'comment-1',
      'Comentário',
      'post-1',
      'author-1',
    ) as Comment;

    expect(comment.updateContent('   ')).toBe(false);
  });
});
