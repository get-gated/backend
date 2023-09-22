import { ServerResponse } from 'http';

import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';

/**
 * @name getResponse
 * @desc
 * Helper util to get a response from either express or graphql
 * @param context execution context from nestjs
 */
export const getResponse = (context: ExecutionContext): ServerResponse => {
  const httpContext = context.switchToHttp();
  let response = httpContext.getResponse();

  if (!response || Object.keys(response).length === 0) {
    const gCtx = GqlExecutionContext.create(context).getContext();
    response = gCtx.res;
  }

  return response;
};
