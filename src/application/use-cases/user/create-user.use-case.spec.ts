import { CreateUserUseCase } from './create-user.use-case';
import {
  Role,
  type PasswordHasherService,
  type UserRepository,
} from '../../../domain';

describe('CreateUserUseCase', () => {
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

  it('returns EMAIL_ALREADY_EXISTS when email is already in use', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    userRepository.findByEmail.mockResolvedValue({} as never);

    const sut = new CreateUserUseCase(userRepository, passwordHasher);

    const result = await sut.execute({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'secret123',
    });

    expect(result).toEqual({
      success: false,
      error: 'EMAIL_ALREADY_EXISTS',
    });
  });

  it('creates a user with PARENT role by default', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('hashed-password');

    const sut = new CreateUserUseCase(userRepository, passwordHasher);

    const result = await sut.execute({
      name: 'Maria',
      email: 'Maria@Example.com',
      password: 'secret123',
    });

    expect(result).toMatchObject({
      success: true,
      user: {
        name: 'Maria',
        email: 'maria@example.com',
        role: Role.PARENT,
      },
    });
    expect(userRepository.save).toHaveBeenCalledTimes(1);
  });
});
