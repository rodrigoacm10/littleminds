export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface TokenService {
  sign(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
