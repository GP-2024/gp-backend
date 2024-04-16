import GeneralEntity from 'src/common/interfaces/generalEntity';
import { PerenualPlants } from 'src/modules/apis/perenual/entities/perenual-details.entity';
import { Users } from 'src/modules/user/entities/users.entity';
import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';

@Entity('my_plants')
export class MyPlants extends GeneralEntity {
  @OneToOne(() => Users, (user) => user.myPlants)
  @JoinColumn({ name: 'username' })
  user: Users;

  @ManyToMany(() => PerenualPlants)
  @JoinTable()
  plants: PerenualPlants[];
}
