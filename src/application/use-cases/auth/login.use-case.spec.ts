import { LoginUseCase } from './login.use-case';
import { Role, User, type PasswordHasherService, type TokenService, type UserRepository } from '../../../domain';

describe('LoginUseCase', () => {
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

  const makeTokenService = (): jest.Mocked<TokenService> => ({
    sign: jest.fn(),
    verify: jest.fn(),
  });

  const makeUser = () =>
    User.reconstitute(
      'user-1',
      'Ana',
      'ana@example.com',
      'stored-hash',
      Role.SPECIALIST,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-02T00:00:00.000Z'),
    );

  it('returns INVALID_CREDENTIALS when user is not found', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    const tokenService = makeTokenService();
    userRepository.findByEmail.mockResolvedValue(null);

    const sut = new LoginUseCase(userRepository, passwordHasher, tokenService);

    const result = await sut.execute({
      email: 'ana@example.com',
      password: 'secret123',
    });

    expect(result).toEqual({
      success: false,
      error: 'INVALID_CREDENTIALS',
    });
    expect(passwordHasher.verify).not.toHaveBeenCalled();
    expect(tokenService.sign).not.toHaveBeenCalled();
  });

  it('returns INVALID_CREDENTIALS when password does not match', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    const tokenService = makeTokenService();
    userRepository.findByEmail.mockResolvedValue(makeUser());
    passwordHasher.verify.mockResolvedValue(false);

    const sut = new LoginUseCase(userRepository, passwordHasher, tokenService);

    const result = await sut.execute({
      email: 'ana@example.com',
      password: 'wrong-password',
    });

    expect(result).toEqual({
      success: false,
      error: 'INVALID_CREDENTIALS',
    });
    expect(tokenService.sign).not.toHaveBeenCalled();
  });

  it('returns access token and user data on successful login', async () => {
    const userRepository = makeUserRepository();
    const passwordHasher = makePasswordHasher();
    const tokenService = makeTokenService();
    userRepository.findByEmail.mockResolvedValue(makeUser());
    passwordHasher.verify.mockResolvedValue(true);
    tokenService.sign.mockResolvedValue('jwt-token');

    const sut = new LoginUseCase(userRepository, passwordHasher, tokenService);

    const result = await sut.execute({
      email: 'ana@example.com',
      password: 'secret123',
    });

    expect(passwordHasher.verify).toHaveBeenCalledWith(
      'secret123',
      'stored-hash',
    );
    expect(tokenService.sign).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'ana@example.com',
      role: Role.SPECIALIST,
    });
    expect(result).toMatchObject({
      success: true,
      accessToken: 'jwt-token',
      user: {
        id: 'user-1',
        name: 'Ana',
        email: 'ana@example.com',
        role: Role.SPECIALIST,
      },
    });
  });
});
