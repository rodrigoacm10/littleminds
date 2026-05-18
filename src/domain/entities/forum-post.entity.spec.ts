import { ForumPost } from './forum-post.entity';
import { AgeGroup } from '../enums/age-group.enum';

describe('ForumPost', () => {
  it('creates a post with trimmed fields', () => {
    const post = ForumPost.create(
      'post-1',
      ' Título ',
      ' Conteúdo ',
      'author-1',
      AgeGroup.BABY,
    );

    expect(post).not.toBeNull();
    expect(post?.title).toBe('Título');
    expect(post?.content).toBe('Conteúdo');
    expect(post?.ageGroup).toBe(AgeGroup.BABY);
  });

  it('updates title, content and age group', () => {
    const post = ForumPost.create(
      'post-1',
      'Título',
      'Conteúdo',
      'author-1',
    ) as ForumPost;

    expect(post.updateTitle(' Novo título ')).toBe(true);
    expect(post.updateContent(' Novo conteúdo ')).toBe(true);
    post.setAgeGroup(AgeGroup.CHILD);
    expect(post.hasAgeGroup()).toBe(true);
    expect(post.ageGroup).toBe(AgeGroup.CHILD);
    post.clearAgeGroup();
    expect(post.ageGroup).toBeNull();
  });

  it('checks authorship and rejects invalid updates', () => {
    const post = ForumPost.create(
      'post-1',
      'Título',
      'Conteúdo',
      'author-1',
    ) as ForumPost;

    expect(post.isAuthoredBy('author-1')).toBe(true);
    expect(post.isAuthoredBy('other-user')).toBe(false);
    expect(post.updateTitle('   ')).toBe(false);
    expect(post.updateContent('   ')).toBe(false);
  });
});
