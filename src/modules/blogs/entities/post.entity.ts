import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import GeneralEntity from '../../../common/interfaces/generalEntity';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { Users } from '../../user/entities/users.entity';
import { Tags } from './tag.entity';

export enum StatusEnum {
  PUBLISHED = 'published',
  DRAFTED = 'drafted',
}
@Entity('posts')
@Index('content_search_vector_idx', { synchronize: false })
export class Posts extends GeneralEntity {
  @Column({ type: 'varchar', length: 20 })
  @IsString()
  @MinLength(3)
  title: string;

  @Column({ type: 'varchar', length: 200 })
  @IsString()
  @MinLength(3)
  content: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.DRAFTED,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  userId: Users;

  @OneToMany(() => Tags, (tag) => tag.id)
  tag_id: Tags;
}
