import { Module, Global } from '@nestjs/common';
import { PrismaService } from '../database/prisma';
import {
  UserRepositoryImpl,
  ForumPostRepositoryImpl,
  CommentRepositoryImpl,
  PostSupportRepositoryImpl,
  ArticleRepositoryImpl,
  ConversationRepositoryImpl,
  MessageRepositoryImpl,
  MessageVersionRepositoryImpl,
} from './index';
import {
  USER_REPOSITORY,
  FORUM_POST_REPOSITORY,
  COMMENT_REPOSITORY,
  POST_SUPPORT_REPOSITORY,
  ARTICLE_REPOSITORY,
  CONVERSATION_REPOSITORY,
  MESSAGE_REPOSITORY,
  MESSAGE_VERSION_REPOSITORY,
} from '../../domain/repositories';

/**
 * RepositoriesModule
 *
 * Módulo que registra todos os repositórios do sistema.
 *
 * Clean Architecture:
 * - Este módulo pertence ao Infrastructure Layer
 * - Implementa as interfaces definidas no Domain Layer
 * - Inversão de Dependência: Use Cases dependem das interfaces,
 *   não das implementações concretas
 *
 * Providers registrados:
 * - UserRepositoryImpl: Persistência de usuários
 * - ForumPostRepositoryImpl: Persistência de posts do fórum
 * - CommentRepositoryImpl: Persistência de comentários
 * - PostSupportRepositoryImpl: Persistência de apoios/likes
 * - ArticleRepositoryImpl: Persistência de artigos
 * - ConversationRepositoryImpl: Persistência de conversas do chatbot
 * - MessageRepositoryImpl: Persistência de mensagens
 * - MessageVersionRepositoryImpl: Persistência de versões de mensagens
 */
@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    {
      provide: FORUM_POST_REPOSITORY,
      useClass: ForumPostRepositoryImpl,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentRepositoryImpl,
    },
    {
      provide: POST_SUPPORT_REPOSITORY,
      useClass: PostSupportRepositoryImpl,
    },
    {
      provide: ARTICLE_REPOSITORY,
      useClass: ArticleRepositoryImpl,
    },
    {
      provide: CONVERSATION_REPOSITORY,
      useClass: ConversationRepositoryImpl,
    },
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessageRepositoryImpl,
    },
    {
      provide: MESSAGE_VERSION_REPOSITORY,
      useClass: MessageVersionRepositoryImpl,
    },
  ],
  exports: [
    USER_REPOSITORY,
    FORUM_POST_REPOSITORY,
    COMMENT_REPOSITORY,
    POST_SUPPORT_REPOSITORY,
    ARTICLE_REPOSITORY,
    CONVERSATION_REPOSITORY,
    MESSAGE_REPOSITORY,
    MESSAGE_VERSION_REPOSITORY,
  ],
})
export class RepositoriesModule {}