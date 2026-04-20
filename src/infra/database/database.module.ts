import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma';

/**
 * DatabaseModule
 *
 * Módulo global que provê o PrismaService para toda a aplicação.
 *
 * Clean Architecture:
 * - Este módulo pertence ao Infrastructure Layer
 * - Exporta o PrismaService para ser usado pelos repositories
 * - Global: disponível em toda a aplicação sem necessidade de importar
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}