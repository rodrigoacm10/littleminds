import { FindUserByEmailUseCase } from './find-user-by-email.use-case';
import { Role, User, type UserRepository } from '../../../domain';

describe('FindUserByEmailUseCase', () => {
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

  const makeUser = () =>
    User.reconstitute(
      'user-1',
      'Maria',
      'maria@example.com',
      'hashed-password',
      Role.PARENT,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns USER_NOT_FOUND when email is not found', async () => {
    const userRepository = makeUserRepository();
    userRepository.findByEmail.mockResolvedValue(null);

    const sut = new FindUserByEmailUseCase(userRepository);

    const result = await sut.execute({ email: 'maria@example.com' });

    expect(result).toEqual({
      success: false,
      error: 'USER_NOT_FOUND',
    });
  });

  it('returns the user when email exists', async () => {
    const userRepository = makeUserRepository();
    userRepository.findByEmail.mockResolvedValue(makeUser());

    const sut = new FindUserByEmailUseCase(userRepository);

    const result = await sut.execute({ email: 'maria@example.com' });

    expect(result).toMatchObject({
      success: true,
      user: {
        id: 'user-1',
        email: 'maria@example.com',
      },
    });
  });
});
