import { Controller, Get, Post, Body, UseGuards, HttpStatus, HttpCode, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '../../common/decorators/public.decorator';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { AtGuard, RtGuard } from '../../common/guards';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/facebook')
  @Public()
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @Public()
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Request() { user }) {
    return { data: user };
  }

  @Post('/local/signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/local/signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signUpDto: SignInDto) {
    return this.authService.signIn(signUpDto);
  }

  @UseGuards(AtGuard)
  @Post('/local/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userPD: object) {
    const userId = userPD['userId'];
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/local/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrentUserId() userPD: string, @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {
    const userId = userPD['userId'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
