/**
 * Domain Layer - Clean Architecture
 *
 * Este módulo exporta todas as entidades, value objects e enums do domínio.
 * O domain layer é o coração da aplicação e deve ser:
 *
 * 1. Independente de frameworks
 * 2. Independente de infraestrutura
 * 3. Testável sem dependências externas
 * 4. Focado nas regras de negócio
 *
 * Estrutura:
 * - enums/     : Tipos enumerados do domínio
 * - value-objects/ : Value Objects com invariantes
 * - entities/  : Entidades do domínio (Aggregate Roots)
 */

// Enums
export {
  Role,
  isValidRole,
  AgeGroup,
  isValidAgeGroup,
  getAgeGroupLabel,
  MessageRole,
  isValidMessageRole,
} from './enums';

// Value Objects
export { Email } from './value-objects';

// Entities
export {
  // User Aggregate
  User,
  // Forum Aggregate
  ForumPost,
  Comment,
  PostSupport,
  // Article Aggregate
  Article,
  // Chat Aggregate
  Conversation,
  Message,
  MessageVersion,
} from './entities';

// Repository Interfaces
export type {
  UserRepository,
  ForumPostRepository,
  CommentRepository,
  PostSupportRepository,
  ArticleRepository,
  ConversationRepository,
  MessageRepository,
  MessageVersionRepository,
} from './repositories';