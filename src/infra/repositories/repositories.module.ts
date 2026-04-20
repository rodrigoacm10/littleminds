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
    UserRepositoryImpl,
    ForumPostRepositoryImpl,
    CommentRepositoryImpl,
    PostSupportRepositoryImpl,
    ArticleRepositoryImpl,
    ConversationRepositoryImpl,
    MessageRepositoryImpl,
    MessageVersionRepositoryImpl,
    PrismaService,
  ],
  exports: [
    UserRepositoryImpl,
    ForumPostRepositoryImpl,
    CommentRepositoryImpl,
    PostSupportRepositoryImpl,
    ArticleRepositoryImpl,
    ConversationRepositoryImpl,
    MessageRepositoryImpl,
    MessageVersionRepositoryImpl,
  ],
})
export class RepositoriesModule {}