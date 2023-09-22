import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequest } from '@app/modules/auth/utils/get-req.util';

import { AuthedUser } from '../identity/auth.adapter';

/**
 * @name User
 * @desc
 * Decorator to be used in args of HTTP Controller
 * or GraphQL Resolvers to inject the current user
 * from the request context
 * @example
 * async myControllerOrResolverHandler(@User() user: AuthedUser) {...}
 */
export const User = createParamDecorator(
  (_data, context: ExecutionContext): AuthedUser => {
    const req = getRequest(context);
    return req.user;
  },
);
