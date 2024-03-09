import { ConfigService } from '@nestjs/config/dist/config.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: configService.get<string>('DB_SYNC') === 'true',
      logging: configService.get<string>('DB_LOGGING') === 'true',
      ssl: configService.get<string>('DB_SSL') === 'true',
      migrations: [`${__dirname}/../../db/migrations/*{.ts,.js)`],
      migrationsTableName: 'migrations',
    };
  }
}
