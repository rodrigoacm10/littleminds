import { RegisterUseCase } from './register.use-case';
import { Role, type PasswordHasherService, type UserRepository } from '../../../domain';

describe('RegisterUseCase', () => {
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

  it('returns EMAIL_ALREADY_EXISTS when email is already registered', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    userRepository.findByEmail.mockResolvedValue({} as never);

    const sut = new RegisterUseCase(userRepository, passwordHasher);

    const result = await sut.execute({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'secret123',
    });

    expect(result).toEqual({
      success: false,
      error: 'EMAIL_ALREADY_EXISTS',
    });
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('creates a parent user by default and persists hashed password', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('hashed-password');

    const sut = new RegisterUseCase(userRepository, passwordHasher);

    const result = await sut.execute({
      name: 'Maria',
      email: 'Maria@Example.com',
      password: 'secret123',
    });

    expect(result.success).toBe(true);
    expect(result.user).toMatchObject({
      name: 'Maria',
      email: 'maria@example.com',
      role: Role.PARENT,
    });
    expect(passwordHasher.hash).toHaveBeenCalledWith('secret123');
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save.mock.calls[0][0].toPersistence()).toMatchObject({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'hashed-password',
      role: Role.PARENT,
    });
  });

  it('returns INVALID_DATA when entity creation fails', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('123');

    const sut = new RegisterUseCase(userRepository, passwordHasher);

    const result = await sut.execute({
      name: 'Maria',
      email: 'maria@example.com',
      password: '123456',
    });

    expect(result).toEqual({
      success: false,
      error: 'INVALID_DATA',
    });
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
