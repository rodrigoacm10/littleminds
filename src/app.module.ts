import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InterfaceModule } from './interface';

@Module({
  imports: [InterfaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
