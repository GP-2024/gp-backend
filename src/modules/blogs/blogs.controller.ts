import { Controller, Post, UseGuards, HttpCode, HttpStatus, Body, Param, Get, Query, UseInterceptors } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { postDTO } from './dto/post-blog.dto';
import { AtGuard } from '../../common/guards';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { commentDTO } from './dto/comment-blog.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { SearchDTO } from './dto/search-blog.dto';

@Controller('blogs')
@UseInterceptors(CacheInterceptor)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/new-post')
  addPost(@Body() postDto: postDTO, @GetCurrentUserId() userPD: object) {
    return this.blogsService.addPost(postDto, userPD);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/new-comment/:id')
  addComment(@Body() commentDto: commentDTO, @Param('id') postID: string, @GetCurrentUserId() userPD: object) {
    return this.blogsService.addComment(commentDto, postID, userPD);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/like/:id')
  likePost(@Param('id') postID: string, @GetCurrentUserId() userPD: object) {
    return this.blogsService.likePost(postID, userPD);
  }
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/dislike/:id')
  dislikePost(@Param('id') postID: string, @GetCurrentUserId() userPD: object) {
    return this.blogsService.dislikePost(postID, userPD);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/all-posts')
  getAllPosts(@Query('page') page: number, @GetCurrentUserId() userPD: object, @Query('q') searchDTO: SearchDTO) {
    return this.blogsService.getAllPosts(page, userPD, searchDTO);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/post/:id')
  getPost(@Param('id') postId: string, @GetCurrentUserId() userPD: object) {
    return this.blogsService.getPost(postId, userPD);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/blogComments/:id')
  getCommentForPost(@Param('id') postId: string, @Query('index') index: number, @GetCurrentUserId() userPD: object) {
    return this.blogsService.getCommentForPost(postId, index, userPD);
  }
}
