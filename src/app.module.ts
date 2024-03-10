import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import TypeOrmConfig from './config/typeorm.config';
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => TypeOrmConfig.getOrmConfig(configService),
    }),
    UserModule,
      AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
