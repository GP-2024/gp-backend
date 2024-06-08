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
import { S3Service } from '../s3/s3.service';
import { signInRES } from './types/signIn.type';
import { formatSignInResponse } from './_helpers/formatResponse';
import { UpdateProfileDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private jwtService: JwtService,
    private s3Service: S3Service,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string; accessToken: string }> {
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
    const signedUp = await this.userService.createUserAccount(signUpDto);

    const tokens: Tokens = await this.getTokens(signedUp.id, signedUp.username);

    return { message: 'User Registered Successful', accessToken: tokens.access_token };
  }

  async signIn(signInDto: SignInDto): Promise<signInRES> {
    const passwordPT = signInDto.password;
    let profileIMG;

    const userDataSearchable = signInDto.email ? { email: signInDto.email } : { username: signInDto.username };

    const userData = await this.userRepository.findOne({
      where: userDataSearchable,
    });

    if (!userData) {
      throw new UnauthorizedException('This user not exist');
    }

    const { password: hashedPassword, id: userId } = userData;

    if (!(await argon2.verify(hashedPassword, passwordPT))) {
      throw new UnauthorizedException('Incorrect password');
    }

    const tokens: Tokens = await this.getTokens(userId, userData.username);

    await this.insertRefreshToken(userId, tokens.refresh_token);

    if (userData.hasProfileImage) {
      const bucketName = process.env.DP_BUCKET_NAME;
      const region = process.env.AWS_REGION;
      const userPD = { userId: userData.id, username: userData.username };
      profileIMG = await this.s3Service.ReadIMG(userPD, bucketName, 'DP', region);
    }

    return formatSignInResponse(userData, profileIMG, tokens);
  }

  async getTokens(userId: string, username: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      username: username,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT,
        expiresIn: '60m',
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

  async InsertDP(userPD: object, dp: Express.Multer.File) {
    const id = userPD['userId'];
    const userData = await this.userRepository.findOneBy({
      id,
    });

    if (!userData) {
      throw new UnauthorizedException('This user not exist');
    }
    const bucketName = process.env.DP_BUCKET_NAME;
    await this.s3Service.uploadIMG(userPD, dp, bucketName, 'DP');
    userData.hasProfileImage = true;
    await userData.save();
    return { message: 'Profile picture successfully uploaded' };
  }

  async updateUserInfo(updateProfileDto: UpdateProfileDto, userPD: object) {
    const id = userPD['userId'];
    const username = userPD['username'];

    const currentUsername = await this.userRepository.findOne({
      where: [{ id: id }],
    });

    if (!currentUsername) {
      throw new BadRequestException('This user not exists');
    }

    if (updateProfileDto.email) {
      const isNewEmailExist = await this.userRepository.findOne({
        where: [{ email: updateProfileDto.email }],
      });

      if (isNewEmailExist) {
        throw new BadRequestException('This email is already exist');
      }

      currentUsername.email = updateProfileDto.email;
    }

    if (updateProfileDto.username) {
      const isNewUserExist = await this.userRepository.findOne({
        where: [{ username: updateProfileDto.username }],
      });

      if (isNewUserExist) {
        throw new BadRequestException('This username is already exist');
      }
      currentUsername.username = updateProfileDto.username;
    }

    const fieldsToUpdate = ['firstName', 'lastName', 'country', 'gender', 'dateOfBirth'];
    fieldsToUpdate.forEach((field) => {
      if (updateProfileDto[field] !== undefined) {
        currentUsername[field] = updateProfileDto[field];
      }
    });

    if (updateProfileDto.password) {
      const hashType: 0 | 1 | 2 = +process.env.ARGON_TYPE as 0 | 1 | 2;
      currentUsername.password = await argon2.hash(updateProfileDto.password, {
        saltLength: +process.env.ARGON_SALT_LENGTH,
        parallelism: +process.env.ARGON_PARALLELISM,
        memoryCost: +process.env.ARGON_MEMORYCOST,
        hashLength: +process.env.ARGON_HASH_LENGTH,
        type: hashType,
      });
    }

    await currentUsername.save();

    return { message: 'Profile data successfully updated' };
  }
}
