import { forwardRef, Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity';
import { Tags } from './entities/tag.entity';
import { Comments } from './entities/comment.entity';
import { Likes } from './entities/likes.entity';
import { UserModule } from '../user/user.module';
import { Users } from '../user/entities/users.entity';
import { QueueModule } from '../queues/queues.module';
import { CacheInvalidationService } from 'src/cache/cacheInvalidation.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Likes, Posts, Tags, Comments, Users]), UserModule, forwardRef(() => QueueModule), CacheModule],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
