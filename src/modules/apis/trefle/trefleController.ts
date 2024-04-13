import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

import { Controller, Get, Query } from '@nestjs/common';
import nodeFetch from 'node-fetch';

@Controller('trefle')
export class trefleController {
  @Get('/get-plants')
  async getPlants() {
    const response = await nodeFetch(`https://trefle.io/api/v1/plants?token=${process.env.TREFLE_API_KEY}`);
    const json = await response.json();
    return json;
  }

  @Get('/get-plant')
  async getPlant(@Query('name') name: string) {
    const response = await nodeFetch(`https://trefle.io/api/v1/plants/${name}?token=${process.env.TREFLE_API_KEY}`);
    const json = await response.json();
    return json;
  }

  @Get('/get-plant-id')
  async getPlantById(@Query('id') id: number) {
    const response = await nodeFetch(`https://trefle.io/api/v1/plants/${id}?token=${process.env.TREFLE_API_KEY}`);
    const json = await response.json();
    return json;
  }
}

//! This is the original code that was in the trefleController.ts file

// import nodeFetch from 'node-fetch';
// import * as dotenv from 'dotenv';

// console.log(process.env.TREFLE_API_KEY);

// (async () => {
//   const response = await nodeFetch(`https://trefle.io/api/v1/plants?token=${process.env.TREFLE_API_KEY}`);
//   const json = await response.json();
//   console.log(json);
// })();

// // (async () => {
// //   const response = await nodeFetch('https://trefle.io//api/v1/plants/quercus-rotundifolia?token=Qcz2zSwkn-gEZYzqSXoCbBX6ZjBUc8wx1ajPtvk1nOY');
// //   const json = await response.json();
// //   console.log(json.data.main_species);
// // })();
