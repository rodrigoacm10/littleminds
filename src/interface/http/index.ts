/**
 * HTTP Interface Layer - Controllers
 *
 * Este módulo exporta todos os controllers HTTP da aplicação.
 * O Interface Layer é responsável por expor a API REST para clientes.
 *
 * Estrutura:
 * - Controllers: Endpoints HTTP que utilizam os use-cases
 */

export { UserController } from './user.controller';
export { AuthController } from './auth.controller';
export { ForumPostController } from './forum-post.controller';
export { CommentController } from './comment.controller';
export { PostSupportController } from './post-support.controller';
export { ArticleController } from './article.controller';
export { ConversationController } from './conversation.controller';
export { MessageController } from './message.controller';
export { MessageVersionController } from './message-version.controller';
