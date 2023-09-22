import { forwardRef, Inject } from '@nestjs/common';
import {
  context,
  Span,
  SpanAttributes,
  SpanContext,
  SpanOptions,
  trace,
  Tracer,
} from '@opentelemetry/api';
import {
  Counter,
  MetricOptions,
  metrics,
  ObservableBase,
} from '@opentelemetry/api-metrics';
import {
  Metric as MetricType,
  SpanEvent,
  Span as SpanType,
} from '@app/modules/telemetry/telemetry.enums';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { MeterProvider } from '@opentelemetry/sdk-metrics-base';
import { LoggerService } from '@app/modules/logger';

import otel from './telemetry.boostrap';

export class TelemetryService {
  private traceProvider: NodeTracerProvider;

  private meterProvider?: MeterProvider;

  private metrics = new Map();

  constructor(
    @Inject(forwardRef(() => LoggerService))
    private log: LoggerService,
  ) {
    this.traceProvider = otel().traceProvider;
    this.meterProvider = otel().meterProvider;
  }

  public getMetricGauge(
    metric: MetricType,
    options?: MetricOptions,
  ): ObservableBase {
    if (this.metrics.has(metric)) return this.metrics.get(metric);

    const gauge = metrics
      .getMeter('gated-api')
      .createObservableGauge(metric, options);

    this.metrics.set(metric, gauge);

    return gauge;
  }

  public getMetricCounter(
    metric: MetricType,
    options?: MetricOptions,
  ): Counter {
    if (this.metrics.has(metric)) return this.metrics.get(metric);

    const counter = metrics
      .getMeter('gated-api')
      .createCounter(metric, options);
    this.metrics.set(metric, counter);

    return counter;
  }

  public addSpanEvent(event: SpanEvent, attributes?: SpanAttributes): void {
    try {
      const currentSpan = this.getSpan();
      currentSpan?.addEvent(event, attributes);
    } catch (error) {
      this.log.error({ error }, 'Error adding span event');
    }
  }

  public async stop(): Promise<void> {
    await Promise.all([
      this.traceProvider.shutdown().then(
        () =>
          this.log.debug('OpenTelemetry Trace Provider shutdown successfully'),
        (error) =>
          this.log.error(
            { error },
            'Error shutting down OpenTelemetry Trace Provider',
          ),
      ),
      this.meterProvider?.shutdown().then(
        () =>
          this.log.debug('OpenTelemetry Meter Provider shutdown successfully'),
        (error) =>
          this.log.error(
            { error },
            'Error shutting down OpenTelemetry Meter Provider',
          ),
      ),
    ]);
  }

  private getTracer(): Tracer {
    return trace.getTracer('default');
  }

  private getSpan(): Span | undefined {
    return trace.getSpan(context.active());
  }

  public getContext(): SpanContext | undefined {
    return this.getSpan()?.spanContext();
  }

  public customSpan(
    spanType: SpanType,
    options?: SpanOptions,
  ): Span | undefined {
    const span = this.getSpan();
    if (!span) {
      return;
    }
    const ctx = trace.setSpan(context.active(), span);
    return this.getTracer().startSpan(spanType, options, ctx);
  }
}
