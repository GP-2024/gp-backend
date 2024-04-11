import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { FacebookStrategy } from './strategies';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/users.entity';
import { AtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([Users]), UserModule],
  controllers: [AuthController],
  providers: [AuthService, FacebookStrategy, AtStrategy],
})
export class AuthModule {}
