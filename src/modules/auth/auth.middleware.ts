import { AuthAdapter } from '@app/modules/auth/identity/auth.adapter';
import { ExpiredTokenException } from '@app/modules/auth/errors/token-expired.error';
import { NextFunction, Request, Response } from 'express';

import { RequestWithUser } from '.';

export function authMiddleware(authAdapter: AuthAdapter) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let authenticationToken = req.headers.authorization;
    if (
      typeof authenticationToken === 'undefined' ||
      authenticationToken === 'undefined'
    ) {
      authenticationToken = req.cookies.authorization;
    }

    if (!authenticationToken) {
      return next();
    }

    try {
      const user = await authAdapter.verifyAuthorization(
        authenticationToken,
        req,
      );
      if (!user) {
        throw new Error('No verified user returned.');
      }
      (req as RequestWithUser).user = user;
    } catch (error) {
      if (error instanceof ExpiredTokenException) {
        res.set('x-gated-token-expired', 'true');
      }
    } finally {
      next();
    }
  };
}
