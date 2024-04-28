import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import { PerenualService } from './perenual.service';
import { PerenualFilterDto } from './dto/perenual-filter.dto';

@Controller('perenual')
@UseGuards(AtGuard)
export class PerenualController {
  constructor(private perenualService: PerenualService) {}

  // TODO: Implement Filter and Pagination
  @Get('/plants-details')
  findAll(@Query() queryParams: PerenualFilterDto) {
    return this.perenualService.findAll(queryParams);
  }

  @Get('/plants-details/:id')
  findOne(@Param('id') id: string) {
    return this.perenualService.findOne(+id);
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
