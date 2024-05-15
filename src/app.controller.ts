import { Controller, Get } from '@nestjs/common';
import { version as nodeVersion } from 'process';

@Controller('/')
export class AppController {
  @Get('health')
  checkHealth(): Record<string, unknown> {
    return {
      status: 'OK',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion,
    };
  }
}
