import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { TokenPayload, TokenService } from '../../domain';

interface JwtBody extends TokenPayload {
  iat: number;
  exp: number;
}

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly secret = process.env.JWT_SECRET ?? 'change-me-in-production';
  private readonly expiresInSeconds = Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 60 * 60 * 24 * 7);

  async sign(payload: TokenPayload): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const body: JwtBody = {
      ...payload,
      iat: now,
      exp: now + this.expiresInSeconds,
    };

    const encodedHeader = this.base64UrlEncode(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    );
    const encodedPayload = this.base64UrlEncode(JSON.stringify(body));
    const signature = this.signValue(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  async verify(token: string): Promise<TokenPayload> {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new Error('INVALID_TOKEN');
    }

    const expectedSignature = this.signValue(`${encodedHeader}.${encodedPayload}`);

    if (signature !== expectedSignature) {
      throw new Error('INVALID_TOKEN');
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf-8'),
    ) as JwtBody;

    if (!payload.sub || !payload.email || !payload.role) {
      throw new Error('INVALID_TOKEN');
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error('TOKEN_EXPIRED');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }

  private signValue(value: string): string {
    return createHmac('sha256', this.secret)
      .update(value)
      .digest('base64url');
  }

  private base64UrlEncode(value: string): string {
    return Buffer.from(value, 'utf-8').toString('base64url');
  }
}
