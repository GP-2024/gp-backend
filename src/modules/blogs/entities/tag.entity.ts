import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNumber, IsString, MinLength } from 'class-validator';
import { Posts } from './post.entity';
import GeneralEntity from '../../../common/interfaces/generalEntity';

@Entity('tags')
export class Tags extends GeneralEntity {
  @Column({ type: 'varchar', length: 20 })
  @IsString()
  @MinLength(3)
  name: string;

  @Column({ type: 'int' })
  @IsNumber()
  frequency: number;

  @ManyToOne(() => Posts, (post) => post.tag_id)
  @JoinColumn({ name: 'post_id' })
  post: Posts;
}
