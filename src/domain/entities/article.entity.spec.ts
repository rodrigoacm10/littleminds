import { Article } from './article.entity';
import { AgeGroup } from '../enums/age-group.enum';

describe('Article', () => {
  it('creates a draft article with trimmed fields', () => {
    const article = Article.create(
      'article-1',
      ' Guia ',
      ' Conteúdo ',
      'author-1',
      ' Resumo ',
      ' https://example.com/capa.png ',
      AgeGroup.BABY,
    );

    expect(article).not.toBeNull();
    expect(article?.title).toBe('Guia');
    expect(article?.content).toBe('Conteúdo');
    expect(article?.summary).toBe('Resumo');
    expect(article?.coverImage).toBe('https://example.com/capa.png');
    expect(article?.isDraft()).toBe(true);
  });

  it('updates mutable fields and publication state', () => {
    const article = Article.create(
      'article-1',
      'Guia',
      'Conteúdo',
      'author-1',
    ) as Article;

    expect(article.updateTitle(' Novo título ')).toBe(true);
    expect(article.updateContent(' Novo conteúdo ')).toBe(true);
    article.updateSummary(' Novo resumo ');
    article.updateCoverImage(' https://example.com/new.png ');
    article.setAgeGroup(AgeGroup.CHILD);
    article.publish();

    expect(article.title).toBe('Novo título');
    expect(article.content).toBe('Novo conteúdo');
    expect(article.summary).toBe('Novo resumo');
    expect(article.coverImage).toBe('https://example.com/new.png');
    expect(article.ageGroup).toBe(AgeGroup.CHILD);
    expect(article.isPublishedStatus()).toBe(true);

    article.clearAgeGroup();
    article.unpublish();
    expect(article.ageGroup).toBeNull();
    expect(article.isDraft()).toBe(true);
  });

  it('checks authorship and rejects invalid updates', () => {
    const article = Article.create(
      'article-1',
      'Guia',
      'Conteúdo',
      'author-1',
    ) as Article;

    expect(article.isAuthoredBy('author-1')).toBe(true);
    expect(article.isAuthoredBy('other-user')).toBe(false);
    expect(article.updateTitle('   ')).toBe(false);
    expect(article.updateContent('   ')).toBe(false);
  });
});
