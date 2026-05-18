import { UpdateArticleUseCase } from './update-article.use-case';
import { AgeGroup, Article, type ArticleRepository } from '../../../domain';

describe('UpdateArticleUseCase', () => {
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
      'Título antigo',
      'Resumo antigo',
      'Conteúdo antigo',
      'https://example.com/old.png',
      false,
      AgeGroup.BABY,
      'author-1',
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns ARTICLE_NOT_FOUND when article does not exist', async () => {
    const articleRepository = makeArticleRepository();
    articleRepository.findById.mockResolvedValue(null);

    const sut = new UpdateArticleUseCase(articleRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'author-1',
      title: 'Novo título',
    });

    expect(result).toEqual({
      success: false,
      error: 'ARTICLE_NOT_FOUND',
    });
  });

  it('returns NOT_AUTHORIZED when requester is not the author', async () => {
    const articleRepository = makeArticleRepository();
    articleRepository.findById.mockResolvedValue(makeArticle());

    const sut = new UpdateArticleUseCase(articleRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'other-user',
      title: 'Novo título',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
  });

  it('updates the article fields and saves it', async () => {
    const articleRepository = makeArticleRepository();
    const article = makeArticle();
    articleRepository.findById.mockResolvedValue(article);

    const sut = new UpdateArticleUseCase(articleRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'author-1',
      title: ' Novo título ',
      content: ' Novo conteúdo ',
      summary: ' Novo resumo ',
      coverImage: ' https://example.com/new.png ',
      ageGroup: AgeGroup.CHILD,
    });

    expect(result).toMatchObject({
      success: true,
      article: {
        title: 'Novo título',
        content: 'Novo conteúdo',
        summary: 'Novo resumo',
        coverImage: 'https://example.com/new.png',
        ageGroup: AgeGroup.CHILD,
      },
    });
    expect(articleRepository.save).toHaveBeenCalledWith(article);
  });

  it('clears age group when null is explicitly provided', async () => {
    const articleRepository = makeArticleRepository();
    const article = makeArticle();
    articleRepository.findById.mockResolvedValue(article);

    const sut = new UpdateArticleUseCase(articleRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'author-1',
      ageGroup: null,
    });

    expect(result).toMatchObject({
      success: true,
      article: {
        ageGroup: null,
      },
    });
  });
});
