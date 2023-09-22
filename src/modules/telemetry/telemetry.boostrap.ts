import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { MetricExporter } from '@google-cloud/opentelemetry-cloud-monitoring-exporter';
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { MeterProvider } from '@opentelemetry/sdk-metrics-base';
import { metrics } from '@opentelemetry/api-metrics';
import { TraceIdRatioBasedSampler } from '@opentelemetry/core';

/**
 * @name telemetry bootstrap
 * @description
 * This is created outside of the normal module
 * pattern as it must be available before Nest
 * App creation in order to bind to the low level
 * Node libraries.
 */

let traceProvider: NodeTracerProvider;
let meterProvider: MeterProvider;

const defaultSampleRatio = 100;

const {
  TRACE_EXPORTER: traceExporter,
  TELEMETRY_SAMPLE_RATIO: sampleRatio,
  TELEMETRY_METRICS_DISABLE: metricsDisable,
} = process.env;

const config = {
  traceExporter,
  telemetrySampleRatio: sampleRatio
    ? parseInt(sampleRatio, 10)
    : defaultSampleRatio,
  telementryMetricsDisable: metricsDisable?.trim() === 'true',
};

export default (): {
  traceProvider: NodeTracerProvider;
  meterProvider?: MeterProvider;
} => {
  if (traceProvider) return { traceProvider, meterProvider };

  let spanProcessor;
  let metricExporter;

  switch (process.env.TRACE_EXPORTER) {
    case 'zipkin':
      spanProcessor = new SimpleSpanProcessor(
        new ZipkinExporter({ serviceName: 'NestJS' }),
      );
      break;
    case 'cloud-trace':
      spanProcessor = new SimpleSpanProcessor(new TraceExporter());
      if (!metricsDisable) {
        metricExporter = new MetricExporter();
      }
      break;
    default:
      spanProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());
  }

  traceProvider = new NodeTracerProvider({
    sampler: new TraceIdRatioBasedSampler(config.telemetrySampleRatio),
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'gated-api',
    }),
  });
  traceProvider.addSpanProcessor(spanProcessor);
  traceProvider.register();

  registerInstrumentations({
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-http': {
          ignoreIncomingPaths: [
            /^\/live/, // lightship liveness check endpoints
            /^\/ready/, // lightship readiness check endpoints
            /^\/computeMetadata/, // gcp infra check endpoints
          ],
        },
      }),
    ],
  });

  if (metricExporter) {
    meterProvider = new MeterProvider({
      exporter: metricExporter,
      interval: 1000,
    });
    metrics.setGlobalMeterProvider(meterProvider);
  }

  return { traceProvider, meterProvider };
};
