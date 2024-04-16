import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import TypeOrmConfig from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { ApiModule } from './modules/apis/api.module';
import { AppController } from './app.controller';
import { MyPlants } from './modules/my-plants/entities/my-plant.entity';
import { MyPlantsModule } from './modules/my-plants/my-plants.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => TypeOrmConfig.getOrmConfig(configService),
    }),

    ApiModule,
    AuthModule,
    UserModule,
    MyPlantsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
