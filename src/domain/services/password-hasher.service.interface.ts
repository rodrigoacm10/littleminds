export interface PasswordHasherService {
  hash(password: string): Promise<string>;
  verify(password: string, hashedPassword: string): Promise<boolean>;
}

export const PASSWORD_HASHER_SERVICE = Symbol('PASSWORD_HASHER_SERVICE');
