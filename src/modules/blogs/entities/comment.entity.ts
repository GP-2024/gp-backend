import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import GeneralEntity from '../../../common/interfaces/generalEntity';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { Users } from '../../user/entities/users.entity';
import { Posts } from './post.entity';
export enum StatusEnum {
  PUBLISHED = 'published',
  DRAFTED = 'drafted',
}
@Entity('comments')
export class Comments extends GeneralEntity {
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
  author: Users;

  @ManyToOne(() => Posts, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Posts;
}
