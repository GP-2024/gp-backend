import { BadRequestException } from '@nestjs/common';
import { isString } from '@nestjs/common/utils/shared.utils';
const emailRegex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;

export function isValid(username: any, email: any): void {
  if (!username && !email) {
    throw new BadRequestException('You must sign in with Email or username');
  }

  if (username && email) {
    throw new BadRequestException('You must sign in with one of them only Email or username');
  }

  if (email) {
    if (!emailRegex.test(email) || !isString(email)) {
      throw new BadRequestException('You must enter a Valid Email to sign in');
    }
  }

  if (username) {
    if (emailRegex.test(username) || !isString(username)) {
      throw new BadRequestException('You must enter a Valid Username to sign in');
    }
  }
}
