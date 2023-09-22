import { SpanContext } from '@opentelemetry/api/build/src/trace/span_context';
import { RequestWithUser } from '@app/modules/auth';

export interface RequestWithTrace extends RequestWithUser {
  trace: SpanContext;
}
