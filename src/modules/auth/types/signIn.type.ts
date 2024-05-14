import { Tokens } from './tokens.type';

export type signIn = {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileIMG?: string;
};

export type signInRES = {
  metadata: signIn;
  tokens: Tokens;
};
