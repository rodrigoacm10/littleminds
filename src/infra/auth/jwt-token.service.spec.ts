import { Role } from '../../domain';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
  const originalSecret = process.env.JWT_SECRET;
  const originalExpiration = process.env.JWT_EXPIRES_IN_SECONDS;

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
    process.env.JWT_EXPIRES_IN_SECONDS = originalExpiration;
    jest.useRealTimers();
  });

  it('signs and verifies a valid token', async () => {
    process.env.JWT_SECRET = 'test-secret';
    const sut = new JwtTokenService();

    const token = await sut.sign({
      sub: 'user-1',
      email: 'ana@example.com',
      role: Role.ADMIN,
    });

    await expect(sut.verify(token)).resolves.toEqual({
      sub: 'user-1',
      email: 'ana@example.com',
      role: Role.ADMIN,
    });
  });

  it('throws INVALID_TOKEN for malformed tokens', async () => {
    process.env.JWT_SECRET = 'test-secret';
    const sut = new JwtTokenService();

    await expect(sut.verify('invalid-token')).rejects.toThrow('INVALID_TOKEN');
  });

  it('throws INVALID_TOKEN when signature does not match', async () => {
    process.env.JWT_SECRET = 'test-secret';
    const sut = new JwtTokenService();
    const token = await sut.sign({
      sub: 'user-1',
      email: 'ana@example.com',
      role: Role.ADMIN,
    });
    const [header, payload] = token.split('.');
    const tamperedToken = `${header}.${payload}.wrong-signature`;

    await expect(sut.verify(tamperedToken)).rejects.toThrow('INVALID_TOKEN');
  });

  it('throws TOKEN_EXPIRED when token is past expiration', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN_SECONDS = '1';
    const sut = new JwtTokenService();

    const token = await sut.sign({
      sub: 'user-1',
      email: 'ana@example.com',
      role: Role.ADMIN,
    });

    jest.setSystemTime(new Date('2024-01-01T00:00:02.000Z'));

    await expect(sut.verify(token)).rejects.toThrow('TOKEN_EXPIRED');
  });
});
