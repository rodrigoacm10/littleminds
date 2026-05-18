import { UpdateUserUseCase } from './update-user.use-case';
import {
  Role,
  User,
  type PasswordHasherService,
  type UserRepository,
} from '../../../domain';

describe('UpdateUserUseCase', () => {
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

  const makePasswordHasher = (): jest.Mocked<PasswordHasherService> => ({
    hash: jest.fn(),
    verify: jest.fn(),
  });

  const makeUser = () =>
    User.reconstitute(
      'user-1',
      'Maria',
      'maria@example.com',
      'stored-password',
      Role.PARENT,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns USER_NOT_FOUND when user does not exist', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    userRepository.findById.mockResolvedValue(null);

    const sut = new UpdateUserUseCase(userRepository, passwordHasher);

    const result = await sut.execute({ id: 'user-1', name: 'Novo nome' });

    expect(result).toEqual({
      success: false,
      error: 'USER_NOT_FOUND',
    });
  });

  it('returns EMAIL_ALREADY_EXISTS when new email is already used', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    userRepository.findById.mockResolvedValue(makeUser());
    userRepository.existsByEmail.mockResolvedValue(true);

    const sut = new UpdateUserUseCase(userRepository, passwordHasher);

    const result = await sut.execute({
      id: 'user-1',
      email: 'novo@example.com',
    });

    expect(result).toEqual({
      success: false,
      error: 'EMAIL_ALREADY_EXISTS',
    });
  });

  it('updates name, email and password, then saves the user', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    const user = makeUser();
    userRepository.findById.mockResolvedValue(user);
    userRepository.existsByEmail.mockResolvedValue(false);
    passwordHasher.hash.mockResolvedValue('hashed-password');

    const sut = new UpdateUserUseCase(userRepository, passwordHasher);

    const result = await sut.execute({
      id: 'user-1',
      name: ' Maria Silva ',
      email: 'Maria.Silva@Example.com',
      password: 'secret123',
    });

    expect(result).toMatchObject({
      success: true,
      user: {
        id: 'user-1',
        name: 'Maria Silva',
        email: 'maria.silva@example.com',
      },
    });
    expect(passwordHasher.hash).toHaveBeenCalledWith('secret123');
    expect(userRepository.save).toHaveBeenCalledWith(user);
  });
});
