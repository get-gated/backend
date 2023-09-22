import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { RequestWithTrace } from '@app/modules/telemetry/request-with-trace.interface';

/**
 * @name getRequest
 * @desc
 * Helper util to get a request from either express or graphql
 * @param context execution context from nestjs
 */
export const getRequest = (context: ExecutionContext): RequestWithTrace => {
  const gCtx = GqlExecutionContext.create(context).getContext();
  let request = gCtx.req;

  if (!request) {
    const httpContext = context.switchToHttp();
    request = httpContext.getRequest<RequestWithTrace>();
  }

  return request;
};
