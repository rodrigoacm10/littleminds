/**
 * Application Layer - Use Cases
 *
 * Este módulo exporta todos os casos de uso da aplicação.
 * O Application Layer contém:
 *
 * 1. Use Cases: Orquestram o fluxo de dados e operações
 * 2. Input/Output types: Contratos de entrada e saída
 *
 * Clean Architecture:
 * - Depende apenas do Domain Layer
 * - Não depende de Infrastructure ou Presentation
 * - Contém lógica de aplicação, não de negócio
 */

// User Use Cases
export * from './user';

// ForumPost Use Cases
export * from './forum-post';

// Comment Use Cases
export * from './comment';

// PostSupport Use Cases
export * from './post-support';

// Article Use Cases
export * from './article';

// Conversation Use Cases
export * from './conversation';

// Message Use Cases
export * from './message';

// MessageVersion Use Cases
export * from './message-version';