import { Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import { RepositoriesModule } from './repositories';

/**
 * InfrastructureModule
 *
 * Módulo principal do Infrastructure Layer.
 * Importado pelo AppModule para disponibilizar toda a infraestrutura.
 *
 * Clean Architecture:
 * - Infrastructure Layer: Implementações concretas de interfaces do domínio
 * - Este módulo é o ponto de entrada para toda a infraestrutura
 * - Exporta DatabaseModule (PrismaService) e RepositoriesModule (todos os repos)
 *
 * Estrutura:
 * - DatabaseModule: Conexão com banco de dados (Prisma)
 * - RepositoriesModule: Implementações dos repositórios do domínio
 */
@Module({
  imports: [DatabaseModule, RepositoriesModule],
  exports: [DatabaseModule, RepositoriesModule],
})
export class InfrastructureModule {}