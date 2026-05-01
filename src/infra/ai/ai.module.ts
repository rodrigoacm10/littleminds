import { Global, Module } from '@nestjs/common';
import { AI_CHAT_SERVICE } from '../../domain';
import { GeminiChatService } from './gemini-chat.service';

@Global()
@Module({
  providers: [
    GeminiChatService,
    {
      provide: AI_CHAT_SERVICE,
      useExisting: GeminiChatService,
    },
  ],
  exports: [AI_CHAT_SERVICE, GeminiChatService],
})
export class AIModule {}
