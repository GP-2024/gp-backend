import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Likes } from './entities/likes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { postDTO } from './dto/post-blog.dto';
import { Posts, StatusEnum } from './entities/post.entity';
import { Users } from '../user/entities/users.entity';
import { commentDTO } from './dto/comment-blog.dto';
import { Comments } from './entities/comment.entity';
import { ProducerService } from '../queues/services/queues.producer';
import { COMMENT_INDEX_SIZE, POST_PAGE_SIZE } from './constants';
import { Post } from './types/post.type';
import { CacheInvalidationService } from 'src/cache/cacheInvalidation.service';
import { SearchDTO } from './dto/search-blog.dto';
import { S3Service } from '../s3/s3.service';
import * as process from 'process';

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
    private cacheInvalidationService: CacheInvalidationService,
    private s3Service: S3Service,
  ) {}

  async addPost(postDto: postDTO, userPD: object, images: []) {
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

    const post = { ...postDto, createdBy: username, status: StatusEnum.PUBLISHED, img_count: images.length };

    try {
      const savedPost = await this.PostsRepository.save(post);

      await this.s3Service.uploadIMG(userPD, undefined, process.env.DP_BUCKET_NAME, 'BLOG', savedPost.id, images);
    } catch (err) {
      throw new Error(err);
    }

    await this.cacheInvalidationService.invalidateKeys('/blogs/all-posts');

    return { message: 'Post Created Successfully' };
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

  async dislikePost(postId: string, userPD: object) {
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

    if (!alreadyLiked) {
      throw new BadRequestException('This user is not Liked the post');
    }

    await this.LikesRepository.remove(alreadyLiked);

    return { message: 'disliked' };
  }

  async likeSave(like: any) {
    await this.LikesRepository.save(like);
  }

  async getAllPosts(page: number, userPD: object, searchDTO: SearchDTO) {
    const username = userPD['username'];
    const searchKey = searchDTO;

    if (page <= 0) {
      throw new BadRequestException('Enter a Valid page number');
    }
    const offset = (page - 1) * POST_PAGE_SIZE;
    let query = this.PostsRepository.createQueryBuilder('post')
      .leftJoin('likes', 'like', 'like.post_id = post.id AND like.deletedAt IS NULL')
      .leftJoin('likes', 'userLikes', `userLikes.post_id = post.id AND userLikes.createdBy = :username AND userLikes.deletedAt IS NULL`, { username })
      .leftJoin('comments', 'comments', 'comments.post_id = post.id AND comments.deletedAt IS NULL')
      .select([
        'post.id AS id',
        'post.createdAt AS "createdAt"',
        'post.title AS title',
        'post.content AS content',
        'post.createdBy AS "createdBy"',
        'post.img_count AS img_count',
        'COUNT(like.id) AS "numOfLikes"',
        'COUNT(comments.id) AS "numOfComments"',
        'COUNT(userLikes.id) > 0 AS "isLikedByUser"',
      ])
      .where('post.status = :status', { status: StatusEnum.PUBLISHED })
      .andWhere('post.deletedAt IS NULL');

    if (searchKey) {
      query.andWhere(`content_search @@ to_tsquery(:searchKey)`, { searchKey });
    }

    query.groupBy('post.id').orderBy('post.createdAt', 'DESC').offset(offset).limit(POST_PAGE_SIZE);

    const posts = await query.getRawMany();

    const promises = posts.map(async (post) => {
      const imgResults = [];

      for (let i = 0; i < post.img_count; i++) {
        console.log('test');
        const imgData = await this.s3Service.ReadIMG(userPD, process.env.DP_BUCKET_NAME, 'BLOG', post.id, i);
        imgResults.push(imgData);
      }
      delete post.img_count;

      post.images = imgResults;

      return post;
    });

    const postsWithData = await Promise.all(promises);

    const numOfPosts = await this.PostsRepository.count({
      where: {
        status: StatusEnum.PUBLISHED,
      },
    });

    return {
      post: postsWithData,
      metadata: {
        currentPage: page,
        postsOnPage: posts.length,
        totalPages: Math.ceil(numOfPosts / POST_PAGE_SIZE),
      },
    };
  }

  async getPost(postId: string, userPD: object) {
    if (!validate(postId, 4)) {
      throw new UnauthorizedException('Unauthorized Access');
    }
    const userid = userPD['userId'];
    const username = userPD['username'];

    const postData = await this.PostsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!postData) {
      throw new BadRequestException('Not a expected post');
    }

    const likedOrNot = await this.LikesRepository.findOne({
      where: {
        post: {
          id: postId,
        },
        createdBy: username.createdBy,
      },
    });

    let isLiked = false;

    if (likedOrNot) {
      isLiked = true;
    }

    const numOfLikes = await this.LikesRepository.count({
      where: {
        post: { id: postId },
      },
    });

    const post: Post = {
      id: postId,
      createdAt: postData.createdAt,
      title: postData.title,
      content: postData.content,
      status: postData.status,
      numberOfLikes: numOfLikes,
      liked: isLiked,
    };

    return post;
  }

  async getCommentForPost(postId: string, index: number, userPD: object) {
    if (!validate(postId, 4)) {
      throw new UnauthorizedException('Unauthorized Access');
    }
    const offset = (index - 1) * COMMENT_INDEX_SIZE;

    const comments = await this.CommentsRepository.createQueryBuilder('comment')
      .select(['comment.id AS id', 'comment.createdBy AS "createdBy"', 'comment.createdAt AS "createdAt"', 'comment.content AS content'])
      .where(`comment.post_id = '${postId}'`)
      .skip(offset)
      .take(COMMENT_INDEX_SIZE)
      .getRawMany();

    const commentsForPost = await this.CommentsRepository.count({
      where: {
        post: {
          id: postId,
        },
      },
    });

    return {
      comments,
      metadata: { allComments: commentsForPost, maximumIndex: Math.ceil(commentsForPost / COMMENT_INDEX_SIZE) },
    };
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
