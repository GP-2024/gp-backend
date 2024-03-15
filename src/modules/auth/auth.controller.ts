import { Controller, Get, Post, Body, UseGuards, HttpStatus, HttpCode, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Request() { user }) {
    return { data: user };
  }

  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signUpDto: SignInDto) {
    return this.authService.signIn(signUpDto);
  }
}
