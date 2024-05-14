import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
import { EntityNotFoundExceptionFilter } from './utlis/notFoundHandler';
import helmet from 'helmet';

import { LoggingMiddleware } from './utlis/requestLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.use(helmet());
  app.use(new LoggingMiddleware().use);

  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(3000);
}
bootstrap();
