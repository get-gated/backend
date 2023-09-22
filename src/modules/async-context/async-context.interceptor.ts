import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AsyncContextService } from '@app/modules/async-context/async-context.service';
import { getRequest } from '@app/modules/auth/utils/get-req.util';

@Injectable()
export class AsyncContextInterceptor implements NestInterceptor {
  constructor(private ac: AsyncContextService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const req = getRequest(context);

    // todo: probably best to move these out of the module itself
    this.ac.register({
      userId: req.user?.userId,
      anonymousId: req.cookies?.ajs_anonymous_id, // provided by Segment frontend JS SDK
    });

    return next.handle();
  }
}
