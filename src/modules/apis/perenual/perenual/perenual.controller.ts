import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import nodeFetch from 'node-fetch';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

@Controller('perenual')
@UseGuards(AtGuard)
export class PerenualController {
  @Get('/species-list')
  async getSpeciesList() {
    const response = await nodeFetch(`https://perenual.com/api/species-list?key=${process.env.PERENNIAL_API_KEY}`);
    const json = await response.json();
    return json;
  }

  @Get('/species/details/:id')
  async getSpeciesDetails(@Param('id') id: number) {
    const response = await nodeFetch(`https://perenual.com/api/species/details/${id}?key=${process.env.PERENNIAL_API_KEY}`);
    const json = await response.json();
    return json;
  }

  @Get('/species-care-guide-list')
  async getSpeciesCareGuideList() {
    const response = await nodeFetch(`https://perenual.com/api/species-care-guide-list?key=${process.env.PERENNIAL_API_KEY}`);
    const json = await response.json();
    return json;
  }
}
