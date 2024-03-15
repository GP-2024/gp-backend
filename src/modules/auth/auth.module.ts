import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { FacebookStrategy } from './strategies';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/users.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([Users]), // add this line

    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FacebookStrategy],
})
export class AuthModule {}
