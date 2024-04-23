import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { MyPlantsService } from './my-plants.service';
import { CreateMyPlantDto } from './dto/create-my-plant.dto';
import { UpdateMyPlantDto } from './dto/update-my-plant.dto';

@Controller('my-plants')
export class MyPlantsController {
  constructor(private readonly myPlantsService: MyPlantsService) {}

  @Post()
  create(@Body() createMyPlantDto: CreateMyPlantDto, @Request() { user }) {
    return this.myPlantsService.create(createMyPlantDto, user.username);
  }

  // TODO: Add filters - pagenation, search, sort
  @Get()
  findAll(@Request() { user }) {
    console.log(user);
    return this.myPlantsService.findAll(user.username);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() { user }) {
    return this.myPlantsService.findOne(+id, user.username);
  }

  @Delete()
  remove(@Body() { id }, @Request() { user }) {
    return this.myPlantsService.remove(id, user);
  }
}
