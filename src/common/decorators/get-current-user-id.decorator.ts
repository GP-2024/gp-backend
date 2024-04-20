import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../modules/auth/types';

export const GetCurrentUserId = createParamDecorator((_: undefined, context: ExecutionContext): object => {
  const request = context.switchToHttp().getRequest();
  const user = request.user as JwtPayload;
  return { userId: user.sub, username: user.username };
});
