import { registerAs } from '@nestjs/config';
import pino, { LoggerOptions } from 'pino';

interface LoggerConfig {
  pino: LoggerOptions;
}

export default registerAs('logger', (): LoggerConfig => {
  const errorReportingFields = {
    // needed for Cloud Error Reporting
    serviceContext: {
      service: process.env.npm_package_name,
      version: process.env.COMMIT_REF_NAME,
    },
    '@type':
      'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logFormatter = (object: any): any => {
    const newLog = { ...object };

    if (object.error && process.env.LOG_ENV !== 'local') {
      newLog.stack_trace = object.error.stack;
    }

    if (object.res) {
      const req = object.res.req || {};
      const { res } = object;
      const reqHeaders = req.headers || {};
      const resHeaders = res.headers || {};
      newLog.httpRequest = {
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        requestSize: reqHeaders['content-length'],
        status: res.statusStatusCode,
        responseSize: resHeaders['content-length'],
        userAgent: reqHeaders['user-agent'],
        remoteIp:
          reqHeaders['x-forwarded-for'] || req.remoteAddress || req.remoteIp,
        // serverIp: string,
        referer: reqHeaders.referer,
        latency: object.latency,
        // cacheLookup: boolean,
        // cacheHit: boolean,
        // cacheValidatedWithOriginServer: boolean,
        // cacheFillBytes: string,
        protocol: reqHeaders['x-forwarded-proto'],
      };

      delete newLog.latency;
    }

    const userLabels = {
      userId: object.userId,
      connectionId: object.connectionId,
    };

    if (Object.keys(userLabels).length > 0)
      newLog['logging.googleapis.com/labels'] = userLabels;

    newLog.user = object.userId;

    if (object.traceId) {
      newLog[
        'logging.googleapis.com/trace'
      ] = `projects/${process.env.AUTH_FIREBASE_PROJECT_ID}/traces/${object.traceId}`; // todo centralize to better gcloud projectid env var
      newLog['logging.googleapis.com/trace_sampled'] = Boolean(
        object.traceFlags,
      );
      delete newLog.traceId;
      delete newLog.traceFlags;
    }

    if (object.spanId) {
      newLog['logging.googleapis.com/spanId'] = object.spanId;
      delete newLog.spanId;
    }

    return newLog;
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const severityFormatter = (label: string) => {
    let severity;
    switch (label) {
      case 'trace':
        severity = 'DEBUG';
        break;
      case 'debug':
        severity = 'DEBUG';
        break;
      case 'info':
        severity = 'INFO';
        break;
      case 'warn':
        severity = 'WARNING';
        break;
      case 'error':
        severity = 'ERROR';
        break;
      case 'fatal':
        severity = 'CRITICAL';
        break;
      default:
        severity = 'DEFAULT';
    }
    return {
      severity,
      ...(['error', 'fatal'].includes(label) &&
        process.env.LOG_ENV !== 'local' &&
        severity &&
        errorReportingFields),
    };
  };

  const pinoOptions: LoggerOptions = {
    formatters: {
      log: logFormatter,
      level: severityFormatter,
    },
    messageKey: 'message',
    level: process.env.LOG_LEVEL,
    serializers: {
      error: pino.stdSerializers.err,
      res: pino.stdSerializers.res,
      req: pino.stdSerializers.req,
    },
  };

  if (process.env.LOG_ENV === 'local') {
    pinoOptions.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: true,
        levelKey: 'severity',
        messageFormat: '{message}',
      },
    };
  }

  return {
    pino: pinoOptions,
  };
});
