import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role, User, type TokenService, type UserRepository } from '../../domain';

describe('JwtAuthGuard', () => {
  const makeTokenService = (): jest.Mocked<TokenService> => ({
    sign: jest.fn(),
    verify: jest.fn(),
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

  const makeUser = () =>
    User.reconstitute(
      'user-1',
      'Maria',
      'maria@example.com',
      'hashed-password',
      Role.ADMIN,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-02T00:00:00.000Z'),
    );

  const makeContext = (authorization?: string) => {
    const request = {
      headers: {
        authorization,
      },
    } as Record<string, unknown>;

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    return { context, request };
  };

  it('throws AUTH_TOKEN_MISSING when authorization header is absent', async () => {
    const tokenService = makeTokenService();
    const userRepository = makeUserRepository();
    const { context } = makeContext();
    const sut = new JwtAuthGuard(tokenService, userRepository);

    await expect(sut.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('AUTH_TOKEN_MISSING'),
    );
  });

  it('throws AUTH_TOKEN_INVALID when token verification fails', async () => {
    const tokenService = makeTokenService();
    const userRepository = makeUserRepository();
    const { context } = makeContext('Bearer invalid-token');
    tokenService.verify.mockRejectedValue(new Error('invalid'));
    const sut = new JwtAuthGuard(tokenService, userRepository);

    await expect(sut.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('AUTH_TOKEN_INVALID'),
    );
  });

  it('throws AUTH_USER_NOT_FOUND when token is valid but user does not exist', async () => {
    const tokenService = makeTokenService();
    const userRepository = makeUserRepository();
    const { context } = makeContext('Bearer valid-token');
    tokenService.verify.mockResolvedValue({
      sub: 'user-1',
      email: 'maria@example.com',
      role: Role.ADMIN,
    });
    userRepository.findById.mockResolvedValue(null);
    const sut = new JwtAuthGuard(tokenService, userRepository);

    await expect(sut.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('AUTH_USER_NOT_FOUND'),
    );
  });

  it('attaches authenticated user to request and returns true for valid token', async () => {
    const tokenService = makeTokenService();
    const userRepository = makeUserRepository();
    const { context, request } = makeContext('Bearer valid-token');
    tokenService.verify.mockResolvedValue({
      sub: 'user-1',
      email: 'maria@example.com',
      role: Role.ADMIN,
    });
    userRepository.findById.mockResolvedValue(makeUser());
    const sut = new JwtAuthGuard(tokenService, userRepository);

    await expect(sut.canActivate(context)).resolves.toBe(true);
    expect(request.user).toMatchObject({
      id: 'user-1',
      name: 'Maria',
      email: 'maria@example.com',
      role: Role.ADMIN,
    });
  });
});
