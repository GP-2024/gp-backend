import { Injectable } from '@nestjs/common';
import nodeFetch from 'node-fetch';
import { Repository } from 'typeorm';
import { PerenualPlants } from './entities/perenual-details.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PerenualService {
  constructor(
    @InjectRepository(PerenualPlants)
    private perenualRepository: Repository<PerenualPlants>,
  ) {}

  async findAll() {
    const plantsDetails = await this.perenualRepository.findAndCount();

    return { data: plantsDetails[0], total: plantsDetails[1] };
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
