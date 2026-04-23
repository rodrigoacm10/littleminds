/**
 * Injection Tokens for Repository Interfaces
 *
 * NestJS não consegue injetar interfaces TypeScript diretamente porque
 * elas são apagadas em runtime. Usamos tokens de injeção para resolver isso.
 *
 * Clean Architecture:
 * - Use Cases dependem das interfaces (tokens)
 * - Infrastructure fornece as implementações concretas
 * - Inversão de Dependência via DI
 */

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export const FORUM_POST_REPOSITORY = Symbol('FORUM_POST_REPOSITORY');
export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');
export const POST_SUPPORT_REPOSITORY = Symbol('POST_SUPPORT_REPOSITORY');
export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');
export const CONVERSATION_REPOSITORY = Symbol('CONVERSATION_REPOSITORY');
export const MESSAGE_REPOSITORY = Symbol('MESSAGE_REPOSITORY');
export const MESSAGE_VERSION_REPOSITORY = Symbol('MESSAGE_VERSION_REPOSITORY');