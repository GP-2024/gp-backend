import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connection established');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });
  }

  async getClient(): Promise<Redis> {
    await this.client.connect();
    return this.client;
  }
}
