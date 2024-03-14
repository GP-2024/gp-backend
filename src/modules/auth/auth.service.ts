import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { JwtPayload, Tokens } from "./types";
import * as argon2 from "argon2";
import { updateDTO } from "./_helpers/updateDto";
import * as process from "process";
import { SignInDto } from "./dto/sign-in.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService,
 ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
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

  async signIn(signInDto:SignInDto) : Promise<Tokens>{

    const email = signInDto.email;
    const passwordPT = signInDto.password;

    const userData = (await this.userService.findUserByEmail(email)).data;

    if (!userData) {throw new UnauthorizedException('This user not exist')}

    const { password: hashedPassword, id: userId } = userData;


    if (!await argon2.verify(hashedPassword,passwordPT)) {
      throw new UnauthorizedException('Incorrect password');
    }

    return await this.getTokens(userId, email);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
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



}
