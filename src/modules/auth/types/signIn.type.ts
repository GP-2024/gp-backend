import { Tokens } from './tokens.type';

export type signIn = {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileIMG?: string;
  country?: string;
  dateOfBirth?: Date;
};

export type signInRES = {
  metadata: signIn;
  tokens: Tokens;
};
