import { Role } from '../enums/role.enum';
import { Email } from '../value-objects/email.vo';

/**
 * User Entity
 *
 * Entidade raiz de agregação de Usuário no sistema Little Minds.
 * Representa pais, especialistas e administradores da plataforma.
 *
 * Clean Architecture Principles:
 * - Entidade pura, sem dependências de frameworks
 * - Encapsulamento: propriedades acessíveis via getters
 * - Invariants protegidos: validações nos métodos
 * - Métodos de domínio: comportamento encapsulado
 *
 * DDD Principles:
 * - Aggregate Root: User é a raiz do agregado
 * - Identity: definida pelo ID único
 * - Consistency: mudanças garantem estado válido
 *
 * Uma entidade é identificada pela sua identidade única (id),
 * não pelos seus atributos. Dois usuários com o mesmo email
 * são entidades diferentes se tiverem IDs diferentes.
 */
export class User {
  // Identidade única
  private readonly _id: string;

  // Atributos de negócio
  private _name: string;
  private _email: Email;
  private _password: string;
  private _role: Role;

  // Timestamps
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  /**
   * Construtor privado para forçar uso do factory method create().
   * Isso garante que toda entidade seja criada em estado válido.
   */
  private constructor(
    id: string,
    name: string,
    email: Email,
    password: string,
    role: Role,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
    this._role = role;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method para criar um novo Usuário.
   *
   * Por que usar factory method ao invés de construtor direto?
   * - Valida todas as regras de negócio antes de criar
   * - Retorna null se os dados forem inválidos
   * - Evita estados inválidos no sistema
   * - Facilita mudanças futuras nas regras de criação
   *
   * @returns User válido ou null se dados inválidos
   */
  static create(
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
  ): User | null {
    // Validações de invariantes
    if (!id || id.trim().length === 0) {
      return null;
    }

    if (!name || name.trim().length === 0) {
      return null;
    }

    if (!password || password.length < 6) {
      return null;
    }

    const emailVO = Email.create(email);
    if (!emailVO) {
      return null;
    }

    const now = new Date();

    return new User(id, name.trim(), emailVO, password, role, now, now);
  }

  /**
   * Reconstrói uma entidade a partir de dados persistidos.
   * Use este método quando carregar dados do banco de dados.
   *
   * Diferente de create(), este método assume que os dados
   * já foram validados anteriormente (ao serem persistidos).
   */
  static reconstitute(
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    const emailVO = Email.unsafeCreate(email);
    return new User(id, name, emailVO, password, role, createdAt, updatedAt);
  }

  // Getters - acesso somente leitura aos atributos

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get role(): Role {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de Domínio - comportamento encapsulado

  /**
   * Atualiza o nome do usuário.
   * Aplica validação antes de modificar.
   */
  updateName(newName: string): boolean {
    if (!newName || newName.trim().length === 0) {
      return false;
    }

    this._name = newName.trim();
    this._updatedAt = new Date();
    return true;
  }

  /**
   * Atualiza o email do usuário.
   * Valida o novo email antes de modificar.
   */
  updateEmail(newEmail: string): boolean {
    const emailVO = Email.create(newEmail);
    if (!emailVO) {
      return false;
    }

    this._email = emailVO;
    this._updatedAt = new Date();
    return true;
  }

  /**
   * Atualiza a senha do usuário.
   * Regras de negócio: senha deve ter pelo menos 6 caracteres.
   */
  updatePassword(newPassword: string): boolean {
    if (!newPassword || newPassword.length < 6) {
      return false;
    }

    this._password = newPassword;
    this._updatedAt = new Date();
    return true;
  }

  /**
   * Verifica se o usuário pode publicar artigos.
   * Apenas especialistas e administradores podem publicar.
   */
  canPublishArticles(): boolean {
    return this._role === Role.SPECIALIST || this._role === Role.ADMIN;
  }

  /**
   * Verifica se o usuário pode moderar conteúdo.
   * Apenas administradores podem moderar.
   */
  canModerateContent(): boolean {
    return this._role === Role.ADMIN;
  }

  /**
   * Verifica se é um usuário especialista.
   */
  isSpecialist(): boolean {
    return this._role === Role.SPECIALIST;
  }

  /**
   * Verifica se é um usuário administrador.
   */
  isAdmin(): boolean {
    return this._role === Role.ADMIN;
  }

  /**
   * Verifica se é um usuário comum (pai/responsável).
   */
  isParent(): boolean {
    return this._role === Role.PARENT;
  }

  // Comparação por identidade

  /**
   * Compara duas entidades pela sua identidade.
   * Dois usuários são iguais se tiverem o mesmo ID.
   */
  equals(other: User): boolean {
    return this._id === other._id;
  }

  /**
   * Serialização para persistência.
   * Retorna um objeto plano com todos os dados.
   */
  toPersistence(): {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      name: this._name,
      email: this._email.value,
      password: this._password,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}