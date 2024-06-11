import { Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UUIDParam } from 'src/common/decorators/uuid-param.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(@UUIDParam('id') id: string) {
    return this.userService.findOne(id);
  }
  // TODO: Add the rest of the CRUD operations After merge tables and entities
}
