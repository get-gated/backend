import { registerAs } from '@nestjs/config';

export enum AppMode {
  API = 'api',
  Job = 'job',
  Worker = 'worker',
  Hybrid = 'hybrid', // to support cut over, having app function both as api and worker in some environments
}

interface appConfig {
  port: number;
  env: string;
  apiBaseRoute: string;
  public: {
    protocol: string;
    port?: number;
    domain: string;
  };
  cors: {
    origin: Array<string>;
    credentials: boolean;
  };
  mode: AppMode;
  releaseVersion: string;
  subscribers?: {
    include?: string[];
    exclude?: string[];
  };
}

function getIncludeSubscribers(): string[] | undefined {
  const value = process.env.SUBSCRIBERS_INCLUDE;
  if (!value) {
    return;
  }
  return value.trim().split(',');
}
function getExcludeSubscribers(): string[] | undefined {
  const value = process.env.SUBSCRIBERS_EXCLUDE;
  if (!value) {
    return;
  }
  return value.trim().split(',');
}

function getSubscribers(): appConfig['subscribers'] {
  const subscribersInclude = getIncludeSubscribers();
  const subscribersExclude = getExcludeSubscribers();
  const subscribers =
    subscribersInclude || subscribersExclude
      ? {
          include: subscribersInclude,
          exclude: subscribersExclude,
        }
      : undefined;
  return subscribers;
}

export default registerAs('app', (): appConfig => {
  let mode: AppMode;
  switch ((process.env.APP_MODE ?? '').toLowerCase()) {
    case 'api':
      mode = AppMode.API;
      break;
    case 'worker':
      mode = AppMode.Worker;
      break;
    case 'hybrid':
      mode = AppMode.Hybrid;
      break;
    case 'job':
      mode = AppMode.Job;
      break;
    default:
      throw new Error('unsupported app mode');
  }

  return {
    apiBaseRoute: process.env.APP_API_BASE_ROUTE ?? 'api',
    port: Number(process.env.PORT),
    env: process.env.NODE_ENV ?? 'development',
    releaseVersion: process.env.COMMIT_REF_NAME ?? 'unknown',
    mode,
    public: {
      port: Number(process.env.APP_PUBLIC_PORT ?? 3000),
      domain: process.env.APP_PUBLIC_DOMAIN ?? 'localhost:3000',
      protocol: process.env.APP_PUBLIC_PROTOCOL ?? 'http',
    },
    cors: {
      origin: process.env.CORS_ORIGINS && JSON.parse(process.env.CORS_ORIGINS),
      credentials: Boolean(process.env.CORS_ORIGINS),
    },
    subscribers: getSubscribers(),
  };
});
