import { FindUserByIdUseCase } from './find-user-by-id.use-case';
import { Role, User, type UserRepository } from '../../../domain';

describe('FindUserByIdUseCase', () => {
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

  it('returns USER_NOT_FOUND when user does not exist', async () => {
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(null);

    const sut = new FindUserByIdUseCase(userRepository);

    const result = await sut.execute({ id: 'user-1' });

    expect(result).toEqual({
      success: false,
      error: 'USER_NOT_FOUND',
    });
  });

  it('returns the user when it exists', async () => {
    const userRepository = makeUserRepository();
    userRepository.findById.mockResolvedValue(makeUser());

    const sut = new FindUserByIdUseCase(userRepository);

    const result = await sut.execute({ id: 'user-1' });

    expect(result).toMatchObject({
      success: true,
      user: {
        id: 'user-1',
        name: 'Maria',
        email: 'maria@example.com',
        role: Role.PARENT,
      },
    });
  });
});
