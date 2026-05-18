import { PublishArticleUseCase } from './publish-article.use-case';
import { Article, Role, User, type ArticleRepository, type UserRepository } from '../../../domain';

describe('PublishArticleUseCase', () => {
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

  const makeUserRepository = (): jest.Mocked<UserRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    existsByEmail: jest.fn(),
    findAll: jest.fn(),
    findByRole: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeAuthor = (role: Role) =>
    User.reconstitute(
      'author-1',
      'Dra. Ana',
      'ana@example.com',
      'hashed-password',
      role,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  const makeDraftArticle = () =>
    Article.reconstitute(
      'article-1',
      'Guia',
      'Resumo',
      'Conteudo',
      'https://example.com/capa.png',
      false,
      null,
      'author-1',
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns ARTICLE_NOT_FOUND when article does not exist', async () => {
    const articleRepository = makeArticleRepository();
    const userRepository = makeUserRepository();
    articleRepository.findById.mockResolvedValue(null);

    const sut = new PublishArticleUseCase(articleRepository, userRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'author-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'ARTICLE_NOT_FOUND',
    });
  });

  it('returns NOT_AUTHORIZED when article author can no longer publish', async () => {
    const articleRepository = makeArticleRepository();
    const userRepository = makeUserRepository();
    articleRepository.findById.mockResolvedValue(makeDraftArticle());
    userRepository.findById.mockResolvedValue(makeAuthor(Role.PARENT));

    const sut = new PublishArticleUseCase(articleRepository, userRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'author-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
    expect(articleRepository.save).not.toHaveBeenCalled();
  });

  it('returns NOT_AUTHORIZED when requester is not the article author', async () => {
    const articleRepository = makeArticleRepository();
    const userRepository = makeUserRepository();
    articleRepository.findById.mockResolvedValue(makeDraftArticle());
    userRepository.findById.mockResolvedValue(makeAuthor(Role.SPECIALIST));

    const sut = new PublishArticleUseCase(articleRepository, userRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'other-user',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
    expect(articleRepository.save).not.toHaveBeenCalled();
  });

  it('returns ALREADY_PUBLISHED when article is already public', async () => {
    const articleRepository = makeArticleRepository();
    const userRepository = makeUserRepository();
    const publishedArticle = makeDraftArticle();
    publishedArticle.publish();
    articleRepository.findById.mockResolvedValue(publishedArticle);
    userRepository.findById.mockResolvedValue(makeAuthor(Role.SPECIALIST));

    const sut = new PublishArticleUseCase(articleRepository, userRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'author-1',
    });

    expect(result).toEqual({
      success: false,
      error: 'ALREADY_PUBLISHED',
    });
  });

  it('publishes the article and persists the change', async () => {
    const articleRepository = makeArticleRepository();
    const userRepository = makeUserRepository();
    const article = makeDraftArticle();
    articleRepository.findById.mockResolvedValue(article);
    userRepository.findById.mockResolvedValue(makeAuthor(Role.SPECIALIST));

    const sut = new PublishArticleUseCase(articleRepository, userRepository);

    const result = await sut.execute({
      id: 'article-1',
      requesterId: 'author-1',
    });

    expect(result).toMatchObject({
      success: true,
      article: {
        id: 'article-1',
        title: 'Guia',
        isPublished: true,
      },
    });
    expect(articleRepository.save).toHaveBeenCalledWith(article);
  });
});
