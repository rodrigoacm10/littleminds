/**
 * Infrastructure Layer - Clean Architecture
 *
 * Este módulo exporta toda a infraestrutura da aplicação.
 * O Infrastructure Layer contém:
 *
 * 1. Database: Conexão com banco de dados (Prisma)
 * 2. Repositories: Implementações dos repositórios do domínio
 *
 * Regras de Clean Architecture:
 * - Infrastructure depende de Domain (nunca o contrário)
 * - Implementa interfaces definidas no Domain Layer
 * - Não contém lógica de negócio
 * - Pode ser substituído sem afetar o Domain ou Application Layer
 */

// Database
export { DatabaseModule, PrismaService } from './database';

// Repositories
export {
  UserRepositoryImpl,
  ForumPostRepositoryImpl,
  CommentRepositoryImpl,
  PostSupportRepositoryImpl,
  ArticleRepositoryImpl,
  ConversationRepositoryImpl,
  MessageRepositoryImpl,
  MessageVersionRepositoryImpl,
  RepositoriesModule,
} from './repositories';

// Module principal
export { InfrastructureModule } from './infra.module';