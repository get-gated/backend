import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

export const AuthFieldMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { info } = ctx;
  const { extensions } = info.parentType.getFields()[info.fieldName];

  const { user } = ctx.context.req;
  if (extensions?.allow) {
    if (extensions.allow === 'me' && info.rootValue.userId !== user.userId) {
      throw new ForbiddenException(
        `User does not have ownership to access "${info.fieldName}" field.`,
      );
    } else if (!user.roles.includes(extensions.allow))
      throw new ForbiddenException(
        `User does not have sufficient permissions to access "${info.fieldName}" field.`,
      );
  }
  return next();
};
