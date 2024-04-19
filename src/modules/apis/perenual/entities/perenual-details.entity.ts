import { MyPlants } from './../../../my-plants/entities/my-plant.entity';
import GeneralEntity from 'src/common/interfaces/generalEntity';
import { Users } from 'src/modules/user/entities/users.entity';
import { Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm';

//! note that we don't need to extend from general entity as we are not using the common fields

@Entity()
export class PerenualPlants {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  common_name: string;

  @Column('simple-array', { nullable: true })
  scientific_name: string[];

  @Column('simple-array', { nullable: true })
  other_name: string[];

  @Column({ nullable: true })
  family: string;

  @Column({ nullable: true })
  type: string;

  @Column('json', { nullable: true })
  dimensions: { type: string; min_value: number; max_value: number; unit: string };

  @Column({ nullable: true })
  cycle: string;

  @Column({ nullable: true })
  watering: string;

  @Column('json', { nullable: true })
  depth_water_requirement: { unit: string; value: string };

  @Column('json', { nullable: true })
  volume_water_requirement: { unit: string; value: string };

  @Column({ nullable: true })
  watering_period: string;

  @Column('json', { nullable: true })
  watering_general_benchmark: { value: number; unit: string };

  @Column('json', { nullable: true })
  plant_anatomy: { [key: string]: string };

  @Column('simple-array', { nullable: true })
  sunlight: string[];

  @Column('simple-array', { nullable: true })
  pruning_month: string[];

  @Column('json', { nullable: true })
  pruning_count: { amount: number; interval: string };

  @Column({ nullable: true })
  seeds: number;

  @Column('simple-array', { nullable: true })
  attracts: string[];

  @Column('simple-array', { nullable: true })
  propagation: string[];

  @Column('json', { nullable: true })
  hardiness: { min: string; max: string };

  @Column('json', { nullable: true })
  hardiness_location: { full_url: string; full_iframe: string };

  @Column({ nullable: true })
  flowers: boolean;

  @Column({ nullable: true })
  flowering_season: string;

  @Column({ nullable: true })
  color: string;

  @Column('simple-array', { nullable: true })
  soil: string[];

  @Column({ nullable: true })
  pest_susceptibility: string;

  @Column({ nullable: true })
  cones: boolean;

  @Column({ nullable: true })
  fruits: boolean;

  @Column({ nullable: true })
  edible_fruit: boolean;

  @Column({ nullable: true })
  fruit_color: string;

  @Column({ nullable: true })
  fruiting_season: string;

  @Column({ nullable: true })
  harvest_season: string;

  @Column({ nullable: true })
  harvest_method: string;

  @Column({ nullable: true })
  leaf: boolean;

  @Column('simple-array', { nullable: true })
  leaf_color: string[];

  @Column({ nullable: true })
  edible_leaf: boolean;

  @Column({ nullable: true })
  growth_rate: string;

  @Column({ nullable: true })
  maintenance: string;

  @Column({ nullable: true })
  medicinal: boolean;

  @Column({ nullable: true })
  poisonous_to_humans: boolean;

  @Column({ nullable: true })
  poisonous_to_pets: boolean;

  @Column({ nullable: true })
  drought_tolerant: boolean;

  @Column({ nullable: true })
  salt_tolerant: boolean;

  @Column({ nullable: true })
  thorny: boolean;

  @Column({ nullable: true })
  invasive: boolean;

  @Column({ nullable: true })
  rare: boolean;

  @Column({ nullable: true })
  rare_level: string;

  @Column({ nullable: true })
  tropical: boolean;

  @Column({ nullable: true })
  cuisine: boolean;

  @Column({ nullable: true })
  indoor: boolean;

  @Column({ nullable: true })
  care_level: string;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  origin: string[];

  @Column({ nullable: true })
  care_guides: string;

  @Column({ nullable: true })
  pest_susceptibility_api: string;

  @Column('simple-array', { nullable: true })
  flower_color: string[];

  @Column({ nullable: true })
  edible_fruit_taste_profile: string;

  @Column({ nullable: true })
  fruit_nutritional_value: string;

  @Column('json', { nullable: true })
  default_image: {
    image_id: number;
    license: number;
    license_name: string;
    license_url: string;
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  };
}
