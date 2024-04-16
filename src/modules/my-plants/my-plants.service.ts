import { Injectable } from '@nestjs/common';
import { UpdateMyPlantDto } from './dto/update-my-plant.dto';
import { PerenualService } from './../../modules/apis/perenual/perenual.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerenualPlants } from '../apis/perenual/entities/perenual-details.entity';
import { readFileSync, writeFileSync } from 'fs';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class MyPlantsService {
  constructor(
    private perenualService: PerenualService,
    @InjectRepository(PerenualPlants)
    private perenualRepository: Repository<PerenualPlants>,
  ) {}

  //! temporary function to scrape all plants from the API, it will be modified to create a plant with the given id
  async create(id: number, user: string) {
    for (let i = 1396; i <= 5000; i++) {
      const plant = await this.perenualService.getSpeciesDetails(i);

      if (plant) {
        let allPlants = [];
        try {
          allPlants = JSON.parse(readFileSync('./all_plants.json', 'utf-8'));
        } catch (error) {}

        if (!allPlants.some((existingPlant) => existingPlant.id === plant.id)) {
          allPlants.push(plant);
          writeFileSync('./all_plants.json', JSON.stringify(allPlants, null, 2));
          console.log(`inserting plant with id: ${i}...`);
        } else if (allPlants.some((existingPlant) => existingPlant.id === plant.id)) {
          console.log('plant already exists with id: ', i);
        }
      }
      //await this.perenualRepository.save(plant);
    }
  }
  //! temporary function to insert all plants from the JSON file
  async insertFromJson() {
    const data = JSON.parse(readFileSync('./all_plants.json', 'utf-8'));

    for (const record of data) {
      if (record.id !== null && record.id !== undefined && record.id !== '') {
        const existingRecord = await this.perenualRepository.findOne(record.id);

        if (!existingRecord) {
          await this.perenualRepository.save(record);
        }
      }
    }
  }

  findAll() {
    return `This action returns all myPlants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} myPlant`;
  }

  update(id: number, updateMyPlantDto: UpdateMyPlantDto) {
    return `This action updates a #${id} myPlant`;
  }

  remove(id: number) {
    return `This action removes a #${id} myPlant`;
  }
}
