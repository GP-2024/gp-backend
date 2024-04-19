import { IsUUID } from 'class-validator';
import GeneralEntity from 'src/common/interfaces/generalEntity';
import { PerenualPlants } from 'src/modules/apis/perenual/entities/perenual-details.entity';
import { Users } from 'src/modules/user/entities/users.entity';
import { Entity, Column, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Entity('my_plants')
@Unique(['plant_id', 'createdBy'])
export class MyPlants extends GeneralEntity {
  @Column()
  plant_id: number;

  @Column()
  createdBy: string;

  @ManyToOne('PerenualPlants', { eager: true }) // Specify the related entity
  @JoinColumn({ name: 'plant_id', referencedColumnName: 'id' }) // Specify the join column
  Plant: PerenualPlants; // Define the property to hold the related entity
}

// @Entity('my_plants')
// @Unique(['plant_id', 'createdBy'])
// // TODO: ADD EXTENDS GeneralEntity
// export class MyPlants {
//   @PrimaryGeneratedColumn('uuid')
//   @IsUUID('4')
//   id: string;

//   @Column()
//   plant_id: number;

//   @Column()
//   createdBy: string;

//   @ManyToOne('PerenualPlants', 'MyPlants')
//   @JoinColumn({ name: 'plant_id', referencedColumnName: 'id' })
//   Plant?: Relation<PerenualPlants>;

//   @ManyToOne('Users', 'MyPlants')
//   @JoinColumn({ name: 'createdBy', referencedColumnName: 'username' })
//   User?: Relation<Users>;
// }
