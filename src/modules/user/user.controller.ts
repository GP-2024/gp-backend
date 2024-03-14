import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UUIDParam } from 'src/decorators/uuid-param.decorator';

@Controller('user')
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
