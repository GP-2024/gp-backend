import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity';
import { Tags } from './entities/tag.entity';
import { Comments } from './entities/comment.entity';
import { Likes } from './entities/likes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Tags, Comments, Likes])],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
