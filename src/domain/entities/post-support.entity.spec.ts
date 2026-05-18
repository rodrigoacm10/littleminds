import { PostSupport } from './post-support.entity';

describe('PostSupport', () => {
  it('creates an immutable support relation', () => {
    const support = PostSupport.create('support-1', 'user-1', 'post-1');

    expect(support).not.toBeNull();
    expect(support?.userId).toBe('user-1');
    expect(support?.postId).toBe('post-1');
  });

  it('checks ownership, target post and duplicate relation', () => {
    const first = PostSupport.create('support-1', 'user-1', 'post-1') as PostSupport;
    const second = PostSupport.create('support-2', 'user-1', 'post-1') as PostSupport;

    expect(first.belongsToUser('user-1')).toBe(true);
    expect(first.isForPost('post-1')).toBe(true);
    expect(first.hasSameUserAndPost(second)).toBe(true);
  });

  it('rejects invalid creation', () => {
    expect(PostSupport.create('', 'user-1', 'post-1')).toBeNull();
    expect(PostSupport.create('support-1', '', 'post-1')).toBeNull();
    expect(PostSupport.create('support-1', 'user-1', '')).toBeNull();
  });
});
