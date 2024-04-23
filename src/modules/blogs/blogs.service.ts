import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Likes } from './entities/likes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { postDTO } from './dto/post-blog.dto';
import { Posts, StatusEnum } from './entities/post.entity';
import { Users } from '../user/entities/users.entity';
import { commentDTO } from './dto/comment-blog.dto';
import { Comments } from './entities/comment.entity';
import { ProducerService } from '../queues/services/queues.producer';
import { likeType } from '../queues/types/like.type';
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

    private producerService: ProducerService,
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

    const savedPost = await this.PostsRepository.save(post);

    return { message: 'Post Created Successfully', postId: savedPost.id };
  }

  async addComment(commentDto: commentDTO, postId: string, userPD: object) {
    const userId = userPD['userId'];
    const username = userPD['username'];

    const postData = await this.postValidation(postId, userId);

    const commentData = { ...commentDto, post: postData, createdBy: username, status: StatusEnum.PUBLISHED };

    await this.CommentsRepository.save(commentData);

    return { message: 'Comment Added Successfully' };
  }

  async likePost(postId: string, userPD: object) {
    const userid = userPD['userId'];
    const username = userPD['username'];

    const postData = await this.postValidation(postId, userid);

    const alreadyLiked = await this.LikesRepository.findOne({
      where: {
        createdBy: username.createdBy,
        post: {
          id: postData.id,
        },
      },
    });

    if (alreadyLiked) {
      throw new BadRequestException('This user is already Liked the post');
    }
    const newLike = { createdBy: username, post: postData };
    await this.producerService.addToLikesQueue(newLike);

    return { message: 'Post Liked Successfully' };
  }

  async likeSave(like: any) {
    await this.LikesRepository.save(like);
  }

  async postValidation(postId: string, userId: string) {
    if (!validate(postId, 4)) {
      throw new UnauthorizedException('Unauthorized Access');
    }

    const userData = await this.UserRepository.findOne({
      where: {
        id: userId,
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

    return postData;
  }
}
