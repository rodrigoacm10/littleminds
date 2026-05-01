import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application';
import {
  ArticleController,
  AuthController,
  CommentController,
  ConversationController,
  ForumPostController,
  MessageController,
  MessageVersionController,
  PostSupportController,
  UserController,
} from './http';

@Module({
  imports: [ApplicationModule],
  controllers: [
    AuthController,
    UserController,
    ForumPostController,
    CommentController,
    PostSupportController,
    ArticleController,
    ConversationController,
    MessageController,
    MessageVersionController,
  ],
})
export class InterfaceModule {}
