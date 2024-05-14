import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { FacebookStrategy, RtStrategy } from './strategies';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/users.entity';
import { AtStrategy } from './strategies';
import { S3Module } from '../s3/s3.module';
import { imgMiddleware } from './middleware/img.validation';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([Users]), UserModule, S3Module],
  controllers: [AuthController],
  providers: [AuthService, FacebookStrategy, AtStrategy, RtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(imgMiddleware).forRoutes('auth/local/signup/dp');
  }
}
