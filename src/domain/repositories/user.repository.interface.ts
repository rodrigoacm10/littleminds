import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';

/**
 * UserRepository Interface
 *
 * Define o contrato para persistência de usuários.
 * Esta interface pertence ao Domain Layer e deve ser
 * implementada pelo Infrastructure Layer.
 *
 * Clean Architecture:
 * - Domain define a interface (o que precisa ser feito)
 * - Infra implementa (como é feito)
 * - Inversão de dependência: Use Cases dependem desta interface
 */
export interface UserRepository {
  /**
   * Salva um usuário (cria ou atualiza).
   */
  save(user: User): Promise<void>;

  /**
   * Busca um usuário pelo ID.
   * Retorna null se não encontrado.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca um usuário pelo email.
   * Retorna null se não encontrado.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Verifica se um email já está em uso.
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Lista todos os usuários.
   */
  findAll(): Promise<User[]>;

  /**
   * Lista usuários por role.
   */
  findByRole(role: Role): Promise<User[]>;

  /**
   * Remove um usuário pelo ID.
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se um usuário existe pelo ID.
   */
  existsById(id: string): Promise<boolean>;
}