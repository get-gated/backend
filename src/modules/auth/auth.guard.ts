// eslint-disable-next-line import/no-extraneous-dependencies
import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ALLOW_KEY,
  AllowRole,
} from '@app/modules/auth/decorators/allow.decorator';
import { LoggerService } from '@app/modules/logger';

import { AuthedUser } from './identity/auth.adapter';
import { SpecialRole } from './auth.enums';
import { getRequest } from './utils/get-req.util';

export interface RequestWithUser extends Request {
  user: AuthedUser;
}

/**
 * @name AuthGuard
 * @desc
 * NestJs Guard to enforce authorization of
 * HTTP Controller endpoints and GraphQL queries and mutations.
 * Enforces a zero-trust policy, meaning every
 * api interface must declare who is allowed.
 * By default, no access is granted.
 *
 * Access can be granted with the @Allow decorator provided by allow.decorator.ts
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private log: LoggerService) {}

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const allow =
      this.reflector.getAllAndOverride<AllowRole[]>(ALLOW_KEY, [
        executionContext.getHandler(),
        executionContext.getClass(),
      ]) || [];

    const isPublic = allow.includes(SpecialRole.Unauthenticated);
    const isAllAuthed = allow.includes(SpecialRole.AllAuthenticated);

    const request = getRequest(executionContext);

    if (!request.user?.roles || request.user.roles.length === 0) {
      return isPublic;
    }

    try {
      let allowed = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const index in request.user.roles) {
        if (allow.includes(request.user.roles[index])) {
          allowed = true;
          break;
        }
      }

      if (!allowed) {
        this.log.debug(
          'No explicit allow role found on route. Checking public/all-authed conditions',
        );
        return isPublic || isAllAuthed;
      }
      return true;
    } catch (error) {
      this.log.error({ error }, 'Error running auth guard');
      return isPublic;
    }
  }
}
