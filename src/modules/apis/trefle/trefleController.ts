import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import nodeFetch from 'node-fetch';
import { SearchPlantsDto } from './dto/search-plants.dto';

@Controller('trefle')
export class trefleController {
  @Get('/plants')
  async getPlants() {
    const response = await nodeFetch(`https://trefle.io/api/v1/plants?token=${process.env.TREFLE_API_KEY}`);
    const json = await response.json();
    return json;
  }

  @Get('/plant')
  async getPlant(@Query('slug') slug: string, @Query('id') id: number) {
    let identifier;

    if (slug) {
      identifier = slug;
    } else if (id) {
      identifier = id;
    } else {
      throw new BadRequestException('Either slug or id must be provided');
    }

    const response = await nodeFetch(`https://trefle.io/api/v1/plants/${identifier}?token=${process.env.TREFLE_API_KEY}`);
    const json = await response.json();
    return json;
  }

  @Get('search')
  async search(@Query() query: SearchPlantsDto) {
    const page = query.page || 1;
    const filter = query.filter || {};

    const response = await nodeFetch(
      `https://trefle.io/api/v1/plants/search?q=${query.q}&page=${page}&filter=${filter}&token=${process.env.TREFLE_API_KEY}`,
    );
    const json = await response.json();
    return json;
  }
}
