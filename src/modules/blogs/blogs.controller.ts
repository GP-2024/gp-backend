import { Controller, Post, UseGuards, HttpCode, HttpStatus, Body, Param } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { postDTO } from './dto/post-blog.dto';
import { AtGuard } from '../../common/guards';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { commentDTO } from './dto/comment-blog.dto';

@Controller('blogs')
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
}
