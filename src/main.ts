import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = new Set([
    'https://littleminds-front.vercel.app',
    'http://localhost:5173',
  ]);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
      callback(null, allowedOrigins.has(normalizedOrigin));
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Little Minds API')
    .setDescription('API para gestão de artigos, conversas, mensagens, fórum e usuários da plataforma Little Minds')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Autenticacao e sessao')
    .addTag('Users', 'Operações de usuários')
    .addTag('Articles', 'Operações de artigos')
    .addTag('Comments', 'Operações de comentários')
    .addTag('Conversations', 'Operações de conversas')
    .addTag('Messages', 'Operações de mensagens')
    .addTag('MessageVersions', 'Operações de versões de mensagem')
    .addTag('ForumPosts', 'Operações de posts do fórum')
    .addTag('PostSupports', 'Operações de apoios em posts')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
