import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application';
import {
  ArticleController,
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
