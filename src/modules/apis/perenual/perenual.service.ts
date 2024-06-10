import { PerenualFilterDto } from './dto/perenual-filter.dto';
import { Injectable } from '@nestjs/common';
import nodeFetch from 'node-fetch';
import { ILike, Repository } from 'typeorm';
import { PerenualPlants } from './entities/perenual-details.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MyPlants } from 'src/modules/my-plants/entities/my-plant.entity';

@Injectable()
export class PerenualService {
  constructor(
    @InjectRepository(PerenualPlants)
    private perenualRepository: Repository<PerenualPlants>,

    @InjectRepository(MyPlants)
    private myPlantRepository: Repository<MyPlants>,
  ) {}

  async findAll(queryParams: PerenualFilterDto, user: string) {
    let plantsDetails;

    plantsDetails = await this.perenualRepository.findAndCount({
      where: queryParams.q
        ? [
            { common_name: ILike(`%${queryParams.q}%`) },
            { scientific_name: ILike(`%${queryParams.q}%`) },
            { other_name: ILike(`%${queryParams.q}%`) },
          ]
        : undefined,
    });

    const userPlants = await this.myPlantRepository.find({
      where: {
        createdBy: user,
      },
    });

    const userPlantIds = userPlants.map((plant) => plant.plant_id);

    const data = plantsDetails[0].map((plant) => ({
      ...plant,
      isAdded: userPlantIds.includes(plant.id),
    }));

    return { data, total: plantsDetails[1] };
  }

  async findOne(id: number) {
    const plantsDetails = await this.perenualRepository.findOneOrFail({
      where: {
        id,
      },
    });

    return plantsDetails;
  }

  async getSpeciesList() {
    const response = await nodeFetch(`https://perenual.com/api/species-list?key=${process.env.PERENNIAL_API_KEY}`);
    return response.json();
  }

  async getSpeciesDetails(id: number) {
    const response = await nodeFetch(`https://perenual.com/api/species/details/${id}?key=${process.env.PERENNIAL_API_KEY}`);
    return response.json();
  }

  async getSpeciesCareGuideList() {
    const response = await nodeFetch(`https://perenual.com/api/species-care-guide-list?key=${process.env.PERENNIAL_API_KEY}`);
    return response.json();
  }
}
