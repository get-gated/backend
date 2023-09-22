import { SetMetadata } from '@nestjs/common';
import { Role, SpecialRole } from '@app/modules/auth';

export const ALLOW_KEY = '__AUTH_ALLOW__';

export type AllowRole = SpecialRole | Role;

/**
 * @name Allow
 * @desc
 * Decorator to be used with HTTP Controller
 * or GraphQL Resolvers to grant access
 * @example
 * @Allow(Role.Admin)
 * async myControllerOrResolverHandler() {...}
 */
export const Allow = (
  roles: AllowRole[] | AllowRole,
): ReturnType<typeof SetMetadata> => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return SetMetadata(ALLOW_KEY, allowedRoles);
};
