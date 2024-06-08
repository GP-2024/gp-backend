import { Tokens } from '../types';
import { signInRES } from '../types/signIn.type';
import { Users } from '../../user/entities/users.entity';

export function formatSignInResponse(userData: Users, profileIMG: string | undefined, tokens?: Tokens): signInRES {
  return {
    metadata: {
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName ?? undefined,
      lastName: userData.lastName ?? undefined,
      profileIMG: profileIMG ?? undefined,
    },
    tokens: {
      access_token: tokens?.access_token,
      refresh_token: tokens?.refresh_token,
    },
  };
}
