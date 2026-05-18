import { Module } from '@nestjs/common';
import {
  ArchiveConversationUseCase,
  CheckUserSupportUseCase,
  CreateCommentUseCase,
  CreateConversationUseCase,
  CreateForumPostUseCase,
  CreatePostSupportUseCase,
  DeleteCommentUseCase,
  DeleteConversationUseCase,
  DeleteForumPostUseCase,
  DeletePostSupportUseCase,
  FindAllCommentsUseCase,
  FindAllConversationsUseCase,
  FindAllForumPostsUseCase,
  FindCommentByIdUseCase,
  FindConversationByIdUseCase,
  FindForumPostByIdUseCase,
  FindPostSupportsByPostUseCase,
  LoginUseCase,
  RegisterUseCase,
  SendMessageToConversationUseCase,
  UnarchiveConversationUseCase,
  UpdateCommentUseCase,
  UpdateConversationTitleUseCase,
  UpdateForumPostUseCase,
} from '../src/application/use-cases';
import {
  AI_CHAT_SERVICE,
  COMMENT_REPOSITORY,
  CONVERSATION_REPOSITORY,
  FORUM_POST_REPOSITORY,
  MESSAGE_REPOSITORY,
  MESSAGE_VERSION_REPOSITORY,
  PASSWORD_HASHER_SERVICE,
  POST_SUPPORT_REPOSITORY,
  TOKEN_SERVICE,
  USER_REPOSITORY,
} from '../src/domain';
import {
  AuthController,
  CommentController,
  ConversationController,
  ForumPostController,
  PostSupportController,
} from '../src/interface/http';
import { JwtAuthGuard } from '../src/interface/security/jwt-auth.guard';
import { JwtTokenService } from '../src/infra/auth/jwt-token.service';
import { NodePasswordHasherService } from '../src/infra/auth/password-hasher.service';
import {
  InMemoryCommentRepository,
  InMemoryConversationRepository,
  InMemoryForumPostRepository,
  InMemoryMessageRepository,
  InMemoryMessageVersionRepository,
  InMemoryPostSupportRepository,
  InMemoryUserRepository,
} from '../src/test-support/in-memory-repositories';

export const e2eAiChatService = {
  generateReply: jest.fn(),
};

@Module({
  controllers: [
    AuthController,
    ForumPostController,
    CommentController,
    PostSupportController,
    ConversationController,
  ],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    CreateForumPostUseCase,
    FindForumPostByIdUseCase,
    FindAllForumPostsUseCase,
    UpdateForumPostUseCase,
    DeleteForumPostUseCase,
    CreateCommentUseCase,
    FindCommentByIdUseCase,
    FindAllCommentsUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    CreatePostSupportUseCase,
    FindPostSupportsByPostUseCase,
    DeletePostSupportUseCase,
    CheckUserSupportUseCase,
    CreateConversationUseCase,
    FindConversationByIdUseCase,
    FindAllConversationsUseCase,
    UpdateConversationTitleUseCase,
    ArchiveConversationUseCase,
    UnarchiveConversationUseCase,
    DeleteConversationUseCase,
    SendMessageToConversationUseCase,
    JwtAuthGuard,
    NodePasswordHasherService,
    JwtTokenService,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: FORUM_POST_REPOSITORY,
      useClass: InMemoryForumPostRepository,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: InMemoryCommentRepository,
    },
    {
      provide: POST_SUPPORT_REPOSITORY,
      useClass: InMemoryPostSupportRepository,
    },
    {
      provide: CONVERSATION_REPOSITORY,
      useClass: InMemoryConversationRepository,
    },
    {
      provide: MESSAGE_REPOSITORY,
      useClass: InMemoryMessageRepository,
    },
    {
      provide: MESSAGE_VERSION_REPOSITORY,
      useClass: InMemoryMessageVersionRepository,
    },
    {
      provide: PASSWORD_HASHER_SERVICE,
      useExisting: NodePasswordHasherService,
    },
    {
      provide: TOKEN_SERVICE,
      useExisting: JwtTokenService,
    },
    {
      provide: AI_CHAT_SERVICE,
      useValue: e2eAiChatService,
    },
  ],
})
export class E2ETestModule {}
