import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configservice: ConfigService) {
    super({
      clientID: configservice.get<number>('APP_ID'),
      clientSecret: configservice.get<number>('APP_SECRET'),
      callbackURL: 'http://localhost:3000/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(accessToken: string, profile: Profile, done: (err: any, user: any, info?: any) => void): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };

    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
