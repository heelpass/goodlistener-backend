import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketIoAdapter } from './chat/adapters/socket-io.adapters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  await app.listen(process.env.SERVER_PORT || 31081);
}

bootstrap();
