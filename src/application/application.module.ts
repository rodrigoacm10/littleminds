import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infra';
import {
  // User
  CreateUserUseCase,
  FindUserByIdUseCase,
  FindUserByEmailUseCase,
  FindAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  // ForumPost
  CreateForumPostUseCase,
  FindForumPostByIdUseCase,
  FindAllForumPostsUseCase,
  UpdateForumPostUseCase,
  DeleteForumPostUseCase,
  // Comment
  CreateCommentUseCase,
  FindCommentByIdUseCase,
  FindAllCommentsUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  // PostSupport
  CreatePostSupportUseCase,
  FindPostSupportsByPostUseCase,
  DeletePostSupportUseCase,
  CheckUserSupportUseCase,
  // Article
  CreateArticleUseCase,
  FindArticleByIdUseCase,
  FindAllArticlesUseCase,
  UpdateArticleUseCase,
  PublishArticleUseCase,
  UnpublishArticleUseCase,
  DeleteArticleUseCase,
  // Conversation
  CreateConversationUseCase,
  FindConversationByIdUseCase,
  FindAllConversationsUseCase,
  UpdateConversationTitleUseCase,
  ArchiveConversationUseCase,
  UnarchiveConversationUseCase,
  DeleteConversationUseCase,
  // Message
  CreateMessageUseCase,
  FindMessageByIdUseCase,
  FindMessagesByConversationUseCase,
  EditMessageUseCase,
  DeleteMessageUseCase,
  RestoreMessageUseCase,
  // MessageVersion
  CreateMessageVersionUseCase,
  FindMessageVersionByIdUseCase,
  FindAllMessageVersionsUseCase,
  FindMessageHistoryUseCase,
  FindCurrentMessageContentUseCase,
  DeleteMessageVersionUseCase,
} from './use-cases';

/**
 * ApplicationModule
 *
 * Módulo principal do Application Layer.
 * Registra todos os Use Cases como providers.
 *
 * Clean Architecture:
 * - Importa InfrastructureModule para ter acesso aos repositórios
 * - Exporta todos os Use Cases para serem usados no Presentation Layer
 */
@Module({
  imports: [InfrastructureModule],
  providers: [
    // User Use Cases
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    // ForumPost Use Cases
    CreateForumPostUseCase,
    FindForumPostByIdUseCase,
    FindAllForumPostsUseCase,
    UpdateForumPostUseCase,
    DeleteForumPostUseCase,
    // Comment Use Cases
    CreateCommentUseCase,
    FindCommentByIdUseCase,
    FindAllCommentsUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    // PostSupport Use Cases
    CreatePostSupportUseCase,
    FindPostSupportsByPostUseCase,
    DeletePostSupportUseCase,
    CheckUserSupportUseCase,
    // Article Use Cases
    CreateArticleUseCase,
    FindArticleByIdUseCase,
    FindAllArticlesUseCase,
    UpdateArticleUseCase,
    PublishArticleUseCase,
    UnpublishArticleUseCase,
    DeleteArticleUseCase,
    // Conversation Use Cases
    CreateConversationUseCase,
    FindConversationByIdUseCase,
    FindAllConversationsUseCase,
    UpdateConversationTitleUseCase,
    ArchiveConversationUseCase,
    UnarchiveConversationUseCase,
    DeleteConversationUseCase,
    // Message Use Cases
    CreateMessageUseCase,
    FindMessageByIdUseCase,
    FindMessagesByConversationUseCase,
    EditMessageUseCase,
    DeleteMessageUseCase,
    RestoreMessageUseCase,
    // MessageVersion Use Cases
    CreateMessageVersionUseCase,
    FindMessageVersionByIdUseCase,
    FindAllMessageVersionsUseCase,
    FindMessageHistoryUseCase,
    FindCurrentMessageContentUseCase,
    DeleteMessageVersionUseCase,
  ],
  exports: [
    // User Use Cases
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    // ForumPost Use Cases
    CreateForumPostUseCase,
    FindForumPostByIdUseCase,
    FindAllForumPostsUseCase,
    UpdateForumPostUseCase,
    DeleteForumPostUseCase,
    // Comment Use Cases
    CreateCommentUseCase,
    FindCommentByIdUseCase,
    FindAllCommentsUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    // PostSupport Use Cases
    CreatePostSupportUseCase,
    FindPostSupportsByPostUseCase,
    DeletePostSupportUseCase,
    CheckUserSupportUseCase,
    // Article Use Cases
    CreateArticleUseCase,
    FindArticleByIdUseCase,
    FindAllArticlesUseCase,
    UpdateArticleUseCase,
    PublishArticleUseCase,
    UnpublishArticleUseCase,
    DeleteArticleUseCase,
    // Conversation Use Cases
    CreateConversationUseCase,
    FindConversationByIdUseCase,
    FindAllConversationsUseCase,
    UpdateConversationTitleUseCase,
    ArchiveConversationUseCase,
    UnarchiveConversationUseCase,
    DeleteConversationUseCase,
    // Message Use Cases
    CreateMessageUseCase,
    FindMessageByIdUseCase,
    FindMessagesByConversationUseCase,
    EditMessageUseCase,
    DeleteMessageUseCase,
    RestoreMessageUseCase,
    // MessageVersion Use Cases
    CreateMessageVersionUseCase,
    FindMessageVersionByIdUseCase,
    FindAllMessageVersionsUseCase,
    FindMessageHistoryUseCase,
    FindCurrentMessageContentUseCase,
    DeleteMessageVersionUseCase,
  ],
})
export class ApplicationModule {}
