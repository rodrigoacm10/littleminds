import { FindArticleByIdUseCase } from './find-article-by-id.use-case';
import { Article, AgeGroup, type ArticleRepository } from '../../../domain';

describe('FindArticleByIdUseCase', () => {
  const makeArticleRepository = (): jest.Mocked<ArticleRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findPublished: jest.fn(),
    findDraftsByAuthor: jest.fn(),
    findByAuthorId: jest.fn(),
    findByAgeGroup: jest.fn(),
    findPublishedByAgeGroup: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeArticle = () =>
    Article.reconstitute(
      'article-1',
      'Guia',
      'Resumo',
      'Conteúdo',
      'https://example.com/capa.png',
      false,
      AgeGroup.CHILD,
      'author-1',
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns ARTICLE_NOT_FOUND when article does not exist', async () => {
    const articleRepository = makeArticleRepository();
    articleRepository.findById.mockResolvedValue(null);

    const sut = new FindArticleByIdUseCase(articleRepository);

    const result = await sut.execute({ id: 'article-1' });

    expect(result).toEqual({
      success: false,
      error: 'ARTICLE_NOT_FOUND',
    });
  });

  it('returns the article when it exists', async () => {
    const articleRepository = makeArticleRepository();
    articleRepository.findById.mockResolvedValue(makeArticle());

    const sut = new FindArticleByIdUseCase(articleRepository);

    const result = await sut.execute({ id: 'article-1' });

    expect(result).toMatchObject({
      success: true,
      article: {
        id: 'article-1',
        title: 'Guia',
        authorId: 'author-1',
        ageGroup: AgeGroup.CHILD,
      },
    });
  });
});
