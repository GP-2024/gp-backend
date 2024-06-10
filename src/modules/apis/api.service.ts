import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { PerenualService } from './perenual/perenual.service';
import { PerenualPlants } from './perenual/entities/perenual-details.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApiService {
  constructor(
    @Inject(forwardRef(() => PerenualService))
    private readonly perenualService: PerenualService,
    @InjectRepository(PerenualPlants)
    private readonly perenualRepository: Repository<PerenualPlants>,
  ) {}

  async create(id: number) {
    for (let i = id; i <= 5000; i++) {
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
    }
  }

  async insertFromJson() {
    const data = JSON.parse(readFileSync('./all_plants.json', 'utf-8'));

    for (const record of data) {
      if (record.id !== null && record.id !== undefined && record.id !== '') {
        const existingRecord = await this.perenualRepository.findOne({
          where: {
            id: record.id,
          },
        });

        if (!existingRecord) {
          await this.perenualRepository.save(record);
        }
      }
    }
  }
}
