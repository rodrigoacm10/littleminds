import { UnpublishArticleUseCase } from './unpublish-article.use-case';
import { Article, type ArticleRepository } from '../../../domain';

describe('UnpublishArticleUseCase', () => {
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

  const makePublishedArticle = () =>
    Article.reconstitute(
      'article-1',
      'Título',
      'Resumo',
      'Conteúdo',
      null,
      true,
      null,
      'author-1',
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns ARTICLE_NOT_FOUND when article does not exist', async () => {
    const articleRepository = makeArticleRepository();
    articleRepository.findById.mockResolvedValue(null);

    const sut = new UnpublishArticleUseCase(articleRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'author-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'ARTICLE_NOT_FOUND',
    });
  });

  it('returns NOT_AUTHORIZED when requester is not the author', async () => {
    const articleRepository = makeArticleRepository();
    articleRepository.findById.mockResolvedValue(makePublishedArticle());

    const sut = new UnpublishArticleUseCase(articleRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'other-user',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
  });

  it('returns NOT_PUBLISHED when article is already draft', async () => {
    const articleRepository = makeArticleRepository();
    const draft = makePublishedArticle();
    draft.unpublish();
    articleRepository.findById.mockResolvedValue(draft);

    const sut = new UnpublishArticleUseCase(articleRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'author-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_PUBLISHED',
    });
  });

  it('unpublishes the article and saves it', async () => {
    const articleRepository = makeArticleRepository();
    const article = makePublishedArticle();
    articleRepository.findById.mockResolvedValue(article);

    const sut = new UnpublishArticleUseCase(articleRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'author-1',
    });

    expect(result).toEqual({ success: true });
    expect(article.isPublished).toBe(false);
    expect(articleRepository.save).toHaveBeenCalledWith(article);
  });
});
