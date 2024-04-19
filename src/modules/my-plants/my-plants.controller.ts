import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { MyPlantsService } from './my-plants.service';
import { CreateMyPlantDto } from './dto/create-my-plant.dto';
import { UpdateMyPlantDto } from './dto/update-my-plant.dto';

@Controller('my-plants')
export class MyPlantsController {
  constructor(private readonly myPlantsService: MyPlantsService) {}

  @Post()
  create(@Body() createMyPlantDto: CreateMyPlantDto, @Request() { user }) {
    return this.myPlantsService.create(createMyPlantDto, user);
  }

  // TODO: Add filters - pagenation, search, sort
  @Get()
  findAll() {
    return this.myPlantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.myPlantsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMyPlantDto: UpdateMyPlantDto) {
  //   return this.myPlantsService.update(+id, updateMyPlantDto);
  // }

  @Delete()
  remove(@Body() { id }, @Request() { user }) {
    return this.myPlantsService.remove(id, user);
  }
}
