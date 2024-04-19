import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
import { EntityNotFoundExceptionFilter } from './utlis/notFoundHandler';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(3000);
}
bootstrap();
