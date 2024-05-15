import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import TypeOrmConfig from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { ApiModule } from './modules/apis/api.module';
import { AppController } from './app.controller';
import { MyPlantsModule } from './modules/my-plants/my-plants.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { QueueModule } from './modules/queues/queues.module';
import { S3Module } from './modules/s3/s3.module';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import Redis from 'ioredis';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => TypeOrmConfig.getOrmConfig(configService),
    }),

    ThrottlerModule.forRoot({
      /**
       * This is will be for all the routes
       * we can override this in the controller level
       * @Throttle({ defualt: { limit: 20, ttl: 60 } })
       */
      throttlers: [{ limit: 20, ttl: seconds(60) }],

      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
        }),
      ),
    }),

    ApiModule,
    AuthModule,
    UserModule,
    MyPlantsModule,
    BlogsModule,
    QueueModule,
    S3Module,
  ],
  controllers: [AppController],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
