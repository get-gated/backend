import { context, trace } from '@opentelemetry/api';
import { NextFunction, Request, Response } from 'express';

export function telemetryMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customReq = req as any;
  const activeSpan = trace.getSpan(context.active());
  customReq.trace = activeSpan?.spanContext();

  if (customReq.user) {
    activeSpan?.setAttribute('user.userId', customReq.user.userId);
  }
  next();
}
