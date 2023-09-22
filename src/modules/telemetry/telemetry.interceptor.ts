import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TelemetryService } from '@app/modules/telemetry/telemetry.service';
import { GqlExecutionContext } from '@nestjs/graphql';

const TRACE_ID_HEADER = 'x-gated-trace-id';

@Injectable()
export class TelemetryInterceptor implements NestInterceptor {
  constructor(private tracing: TelemetryService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<any> | Promise<Observable<any>> {
    const { traceId } = this.tracing.getContext() ?? {};

    const gCtx = GqlExecutionContext.create(context).getContext();
    let response = gCtx.req?.res;

    if (!response) {
      const httpContext = context.switchToHttp();
      response = httpContext.getResponse();
      response.set(TRACE_ID_HEADER, traceId);
    } else {
      gCtx.req.res.set(TRACE_ID_HEADER, traceId);
    }

    return next.handle();
  }
}
