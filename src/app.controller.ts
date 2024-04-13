import { Controller, Get } from '@nestjs/common';

//! Note This will be health check endpoint
@Controller('/')
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello world!';
  }
}
