import { AtGuard } from 'src/common/guards';
import { ApiService } from './api.service';
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';

@Controller('scrap')
@UseGuards(AtGuard)
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post()
  async create(@Body() { id }) {
    return this.apiService.create(id);
  }

  @Post('insert-from-json')
  async insertFromJson() {
    await this.apiService.insertFromJson();
    return 'Data inserted from JSON file';
  }
}
