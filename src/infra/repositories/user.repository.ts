import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma';
import {
  UserRepository,
  User,
} from '../../domain';
import { Role } from '../../domain/enums/role.enum';

/**
 * UserRepositoryImpl
 *
 * Implementação concreta do UserRepository usando Prisma.
 * Pertence ao Infrastructure Layer.
 *
 * Responsabilidades:
 * - Traduzir entre entidades de domínio e modelos Prisma
 * - Executar operações de persistência
 * - Não conter lógica de negócio
 */
@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    const data = user.toPersistence();

    await this.prisma.user.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return User.reconstitute(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role as Role,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return User.reconstitute(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role as Role,
      user.createdAt,
      user.updatedAt,
    );
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });

    return count > 0;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) =>
      User.reconstitute(
        user.id,
        user.name,
        user.email,
        user.password,
        user.role as Role,
        user.createdAt,
        user.updatedAt,
      ),
    );
  }

  async findByRole(role: Role): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { role },
    });

    return users.map((user) =>
      User.reconstitute(
        user.id,
        user.name,
        user.email,
        user.password,
        user.role as Role,
        user.createdAt,
        user.updatedAt,
      ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id },
    });

    return count > 0;
  }
}