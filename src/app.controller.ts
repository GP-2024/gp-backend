import { Controller, Get, Post, Body, UseGuards, HttpStatus, HttpCode, Request } from '@nestjs/common';
import { version as nodeVersion } from 'process';
import { AuthGuard } from '@nestjs/passport';
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
