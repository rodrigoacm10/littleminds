import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

/**
 * PrismaService
 *
 * Service que encapsula o PrismaClient para uso em toda a aplicação.
 * Implementa OnModuleInit e OnModuleDestroy para gerenciar conexões.
 *
 * Clean Architecture:
 * - Este service pertence ao Infrastructure Layer
 * - É injetado nos repositories para acessar o banco
 *
 * Prisma 7.x:
 * - Usa o adapter pattern para conexão com PostgreSQL
 * - Configurado via PrismaPg adapter
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });

    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}