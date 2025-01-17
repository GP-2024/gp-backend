import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { PerenualService } from './../../modules/apis/perenual/perenual.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMyPlantDto } from './dto/create-my-plant.dto';
import { MyPlants } from './entities/my-plant.entity';
import { MyPlantsFilterDto } from './dto/my-plants-filter.dto';
import { Brackets } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheInvalidationService } from 'src/cache/cacheInvalidation.service';

@Injectable()
export class MyPlantsService {
  constructor(
    @Inject(forwardRef(() => PerenualService))
    private perenualService: PerenualService,
    @InjectRepository(MyPlants)
    private myPlantRepository: Repository<MyPlants>,
    private cacheInvalidationService: CacheInvalidationService,
  ) {}

  async create(createMyPlantDto: CreateMyPlantDto, user: string) {
    const alreadyAdded = await this.myPlantRepository.findOne({
      where: {
        createdBy: user,
        Plant: {
          id: createMyPlantDto.plantId,
        },
      },
      withDeleted: true,
    });

    if (alreadyAdded) {
      throw new BadRequestException('Plant already added to your plants');
    }

    // First Check if plant with this id exists in the perenual_plants table
    // If not found it will throw an error
    const plant = await this.perenualService.findOne(createMyPlantDto.plantId);

    const newPlant = this.myPlantRepository.create({
      Plant: plant,
      createdBy: user,
    });

    await this.cacheInvalidationService.invalidateKeys('/my-plants');

    return await this.myPlantRepository.save(newPlant);
  }

  // TODO: Add filters - pagenation, search, sort

  // FindAll user plants
  async findAll(queryParams: MyPlantsFilterDto, user: string) {
    const queryBuilder = this.myPlantRepository.createQueryBuilder('myPlant');

    queryBuilder.leftJoinAndSelect('myPlant.Plant', 'plant').where('myPlant.createdBy = :user', { user });

    if (queryParams.q) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('plant.common_name ILike :search').orWhere('plant.scientific_name ILike :search').orWhere('plant.other_name ILike :search');
        }),
        { search: `%${queryParams.q}%` },
      );
    }

    const [plants, total] = await queryBuilder.getManyAndCount();

    return {
      plants,
      total,
    };
  }

  // FindOne plant by id with createdBy
  async findOne(id: number, user: string) {
    return await this.myPlantRepository.findOneOrFail({
      where: {
        Plant: {
          id,
        },
        createdBy: user,
      },
    });
  }

  // TODO: We shoud  specify shoud we allow multiple delete or not, now we are allowing only one delete
  async remove(id: string, user: string) {
    // temporary code to test the service
    return await this.myPlantRepository.update(
      { id },
      {
        deletedAt: new Date(),
        deletedBy: user,
      },
    );
  }
}
