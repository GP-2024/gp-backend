import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { MyPlantsService } from './my-plants.service';
import { CreateMyPlantDto } from './dto/create-my-plant.dto';
import { UpdateMyPlantDto } from './dto/update-my-plant.dto';

@Controller('my-plants')
export class MyPlantsController {
  constructor(private readonly myPlantsService: MyPlantsService) {}

  @Post()
  create(@Body() { id }, @Request() { user }) {
    return this.myPlantsService.create(id, user);
  }

  //! temporary route to insert all plants from the JSON file
  @Post('insert-from-json')
  async insertFromJson() {
    await this.myPlantsService.insertFromJson();
    return 'Data inserted from JSON file';
  }

  @Get()
  findAll() {
    return this.myPlantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.myPlantsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMyPlantDto: UpdateMyPlantDto) {
    return this.myPlantsService.update(+id, updateMyPlantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.myPlantsService.remove(+id);
  }
}
