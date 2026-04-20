/**
 * Email Value Object
 *
 * Value Object que encapsula a lógica de validação de email.
 * Garante que qualquer email no sistema esteja em formato válido.
 *
 * Por que usar um Value Object?
 * - Garante invariantes: email sempre válido
 * - Evita duplicação de validação em múltiplos lugares
 * - Torna o código mais expressivo (Email ao invés de string)
 * - Facilita mudanças futuras (regras de validação centralizadas)
 *
 * Características de um Value Object:
 * - Imutável (readonly)
 * - Não tem identidade própria (dois emails iguais são indistinguíveis)
 * - Comparação por valor, não por referência
 */
export class Email {
  private readonly _value: string;

  private constructor(email: string) {
    this._value = email;
  }

  /**
   * Factory method para criar um Email.
   * Retorna um Result para tratamento de erros de forma explícita.
   *
   * @param email - String a ser validada como email
   * @returns Email válido ou null se inválido
   */
  static create(email: string): Email | null {
    if (!email || email.trim().length === 0) {
      return null;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!Email.isValidEmail(trimmedEmail)) {
      return null;
    }

    return new Email(trimmedEmail);
  }

  /**
   * Cria um Email sem validação.
   * Use apenas quando tiver certeza absoluta de que o email é válido.
   * Preferir o método create() em produção.
   */
  static unsafeCreate(email: string): Email {
    return new Email(email.toLowerCase());
  }

  /**
   * Validação de formato de email.
   * Usa regex simples mas suficiente para validação básica.
   * Para validação mais robusta, considere usar bibliotecas especializadas.
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Retorna o valor do email.
   */
  get value(): string {
    return this._value;
  }

  /**
   * Retorna o domínio do email (parte após o @).
   * Útil para identificar provedores ou filtrar emails corporativos.
   */
  get domain(): string {
    return this._value.split('@')[1];
  }

  /**
   * Retorna a parte local do email (antes do @).
   */
  get localPart(): string {
    return this._value.split('@')[0];
  }

  /**
   * Comparação por valor.
   * Dois Value Objects são iguais se seus valores forem iguais.
   */
  equals(other: Email): boolean {
    return this._value === other._value;
  }

  /**
   * Representação string para serialização.
   */
  toString(): string {
    return this._value;
  }

  /**
   * Representação para JSON.
   */
  toJSON(): string {
    return this._value;
  }
}