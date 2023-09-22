import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private log: LoggerService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = new Date().getTime();
    return next.handle().pipe(
      tap(() => {
        const httpContext = context.switchToHttp();
        let res = httpContext.getResponse();
        let req = httpContext.getRequest();

        if (!res || Object.keys(res).length === 0) {
          const gCtx = GqlExecutionContext.create(context).getContext();

          res = gCtx.res;
          req = gCtx.req;
        }
        const latencyMillis = new Date().getTime() - start;
        const latency = `${latencyMillis / 1000}s`;
        this.log.info({ res, req, latency }, 'Responding to http request');
      }),
    );
  }
}
