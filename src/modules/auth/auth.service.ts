import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
// import { Tokens } from "./types";
import * as argon2 from 'argon2';
import { updateDTO } from './_helpers/updateDto';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(authDto: AuthDto): Promise<{ message: string }> {
    const hashType: 0 | 1 | 2 = +process.env.ARGON_TYPE as 0 | 1 | 2;

    const hash = await argon2.hash(authDto.password, {
      saltLength: +process.env.ARGON_SALT_LENGTH,
      parallelism: +process.env.ARGON_PARALLELISM,
      memoryCost: +process.env.ARGON_MEMORYCOST,
      hashLength: +process.env.ARGON_HASH_LENGTH,
      type: hashType,
    });

    updateDTO.updateDtoAuth(hash, authDto);

      await this.userService.createUserAccount(authDto);
    return { message: 'User Registered Successful' };
  }
}
