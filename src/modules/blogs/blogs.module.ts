import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity';
import { Tags } from './entities/tag.entity';
import { Comments } from './entities/comment.entity';
import { Likes } from './entities/likes.entity';
import { UserModule } from '../user/user.module';
import { Users } from '../user/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Likes, Posts, Tags, Comments, Users]), UserModule],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
