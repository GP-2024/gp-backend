import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Likes } from './entities/likes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { postDTO } from './dto/post-blog.dto';
import { Posts, StatusEnum } from './entities/post.entity';
import { Users } from '../user/entities/users.entity';
import { commentDTO } from './dto/comment-blog.dto';
import { Comments } from './entities/comment.entity';
var validate = require('uuid-validate');

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Likes)
    private readonly LikesRepository: Repository<Likes>,

    @InjectRepository(Posts)
    private readonly PostsRepository: Repository<Posts>,

    @InjectRepository(Users)
    private readonly UserRepository: Repository<Users>,

    @InjectRepository(Comments)
    private readonly CommentsRepository: Repository<Comments>,
  ) {}

  async addPost(postDto: postDTO, userPD: object) {
    const id = userPD['userId'];
    const username = userPD['username'];
    const user = await this.UserRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized Access');
    }

    const post = { ...postDto, createdBy: username, status: StatusEnum.PUBLISHED };

    await this.PostsRepository.save(post);

    return { message: 'Post Created Successfully' };
  }

  async addComment(commentDto: commentDTO, postId: string, userPD: object) {
    const id = userPD['userId'];
    const username = userPD['username'];

    if (!validate(postId, 4)) {
      throw new UnauthorizedException('Unauthorized Access');
    }

    const userData = await this.UserRepository.findOne({
      where: {
        id,
      },
    });
    if (!userData) {
      throw new UnauthorizedException('Unauthorized Access');
    }

    const postData = await this.PostsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!postData) {
      throw new UnauthorizedException('Unauthorized Access');
    }

    const commentData = { ...commentDto, post: postData, createdBy: username, status: StatusEnum.PUBLISHED };

    await this.CommentsRepository.save(commentData);

    return { message: 'Comment Added Successfully' };
  }
}
