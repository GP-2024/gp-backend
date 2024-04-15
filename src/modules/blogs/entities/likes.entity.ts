import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from '../../user/entities/users.entity';
import { Posts } from './post.entity';
import GeneralEntity from '../../../common/interfaces/generalEntity';

@Entity('likes')
export class Likes extends GeneralEntity {
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Posts, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Posts;
}
