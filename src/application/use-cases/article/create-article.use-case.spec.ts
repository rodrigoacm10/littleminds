import { CreateArticleUseCase } from './create-article.use-case';
import { AgeGroup, Article, Role, User, type ArticleRepository, type UserRepository } from '../../../domain';

describe('CreateArticleUseCase', () => {
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
      'Dr. Ana',
      'ana@example.com',
      'hashed-password',
      role,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns AUTHOR_NOT_FOUND when author does not exist', async () => {
    const articleRepository = makeArticleRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(null);

    const sut = new CreateArticleUseCase(articleRepository, userRepository);

    const result = await sut.execute({
      authorId: 'author-1',
      title: 'Article',
      content: 'Content',
    });

    expect(result).toEqual({
      success: false,
      error: 'AUTHOR_NOT_FOUND',
    });
    expect(articleRepository.save).not.toHaveBeenCalled();
  });

  it('returns NOT_AUTHORIZED when author cannot publish articles', async () => {
    const articleRepository = makeArticleRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(makeAuthor(Role.PARENT));

    const sut = new CreateArticleUseCase(articleRepository, userRepository);

    const result = await sut.execute({
      authorId: 'author-1',
      title: 'Article',
      content: 'Content',
    });

    expect(result).toEqual({
      success: false,
      error: 'NOT_AUTHORIZED',
    });
    expect(articleRepository.save).not.toHaveBeenCalled();
  });

  it('creates a draft article for specialists and admins', async () => {
    const articleRepository = makeArticleRepository();
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(makeAuthor(Role.SPECIALIST));

    const sut = new CreateArticleUseCase(articleRepository, userRepository);

    const result = await sut.execute({
      authorId: 'author-1',
      title: ' Guia do Sono ',
      content: ' Conteudo do artigo ',
      summary: ' Resumo ',
      coverImage: ' https://example.com/capa.png ',
      ageGroup: AgeGroup.BABY,
    });

    expect(result).toMatchObject({
      success: true,
      article: {
        title: 'Guia do Sono',
        content: 'Conteudo do artigo',
        summary: 'Resumo',
        coverImage: 'https://example.com/capa.png',
        isPublished: false,
        ageGroup: AgeGroup.BABY,
        authorId: 'author-1',
      },
    });
    expect(articleRepository.save).toHaveBeenCalledTimes(1);
    expect(articleRepository.save.mock.calls[0][0]).toBeInstanceOf(Article);
  });
});
