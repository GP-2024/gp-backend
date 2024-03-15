import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from '../auth.service';
import { createDefaultPassword } from 'src/utlis/defaultPassword';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/modules/user/entities/users.entity';
import { Repository } from 'typeorm';

//TODO: Make user that come from external provider complete thier registration
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    configservice: ConfigService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configservice.get<string>('APP_ID'),
      clientSecret: configservice.get<string>('APP_SECRET'),
      callbackURL: 'http://localhost:3000/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name', 'displayName'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user: any, info?: any) => void): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      username: profile.displayName,
      password: createDefaultPassword(),
      gender: null,
      dateOfBirth: null,
    };

    const existingUser = await this.userRepository.findOne({ where: { email: user.email } });

    // If the user already exists, we need to return a JWT. There are two possible approaches:

    /*
   1) Generate and return the token directly here.

   2) Return the user object and delegate the token creation to the user service.
      This approach requires us to check the login type (Facebook, Google, local).
      If the login type is not local, we return the user object and let the user service handle the token creation,
      bypassing the password comparison method.

   Current implementation: We're using the first approach for now.
  */
    if (existingUser) {
      done(null, await this.authService.getTokens(existingUser.id, existingUser.email));
    }

    // if user does not exist, Sign up the user
    else {
      done(null, await this.authService.signUp(user));
    }
  }
}
