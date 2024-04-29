import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtPayload, Tokens } from './types';
import * as argon2 from 'argon2';
import { updateDTO } from './_helpers/updateDto';
import * as process from 'process';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../user/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    const userExist = await this.userRepository.findOne({
      where: [{ email: signUpDto.email }, { username: signUpDto.username }],
    });

    if (userExist) {
      throw new BadRequestException('This user already exists');
    }
    const hashType: 0 | 1 | 2 = +process.env.ARGON_TYPE as 0 | 1 | 2;

    const hash = await argon2.hash(signUpDto.password, {
      saltLength: +process.env.ARGON_SALT_LENGTH,
      parallelism: +process.env.ARGON_PARALLELISM,
      memoryCost: +process.env.ARGON_MEMORYCOST,
      hashLength: +process.env.ARGON_HASH_LENGTH,
      type: hashType,
    });

    updateDTO.updateDtoAuth(hash, signUpDto);

    await this.userService.createUserAccount(signUpDto);
    return { message: 'User Registered Successful' };
  }

  async signIn(signInDto: SignInDto): Promise<Tokens> {
    const email = signInDto.email;
    const passwordPT = signInDto.password;

    const userData = (await this.userService.findUserByEmail(email)).data;

    if (!userData) {
      throw new UnauthorizedException('This user not exist');
    }

    const { password: hashedPassword, id: userId } = userData;

    if (!(await argon2.verify(hashedPassword, passwordPT))) {
      throw new UnauthorizedException('Incorrect password');
    }

    const tokens: Tokens = await this.getTokens(userId, userData.username);

    await this.insertRefreshToken(userId, tokens.refresh_token);

    return tokens;
  }

  async getTokens(userId: string, username: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      username: username,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.RT,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (user.refreshToken) {
      user.refreshToken = null;
    }
    await user.save();

    return { message: 'logout successful' };
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await argon2.verify(user.refreshToken, rt);

    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.insertRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async insertRefreshToken(userID: string, refreshToken: string): Promise<void> {
    const user = (await this.userService.findOne(userID)).data;
    user.refreshToken = await argon2.hash(refreshToken, { hashLength: +process.env.ARGON_HASH_LENGTH_REFRESH_TOKEN });
    await user.save();
  }
}
