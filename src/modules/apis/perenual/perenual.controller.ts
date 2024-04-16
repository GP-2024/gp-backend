import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import { PerenualService } from './perenual.service';

@Controller('perenual')
@UseGuards(AtGuard)
export class PerenualController {
  constructor(private perenualService: PerenualService) {}

  @Get('/plants-details')
  findAll() {
    return this.perenualService.findAll();
  }

  // This routes is fetching the species list from the API

  @Get('/species-list')
  getSpeciesList() {
    return this.perenualService.getSpeciesList();
  }

  @Get('/species/details/:id')
  getSpeciesDetails(@Param('id') id: string) {
    return this.perenualService.getSpeciesDetails(+id);
  }

  @Get('/species-care-guide-list')
  getSpeciesCareGuideList() {
    return this.perenualService.getSpeciesCareGuideList();
  }
}
