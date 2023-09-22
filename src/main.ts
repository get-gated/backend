import 'source-map-support/register';
import * as http from 'http';

import { NestFactory } from '@nestjs/core';
import {
  INestApplication,
  INestApplicationContext,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import { NextFunction, Request, Response } from 'express';
import { MikroOrmStorage } from '@app/modules/db';
import { MikroORM } from '@mikro-orm/core';
import { ConfigType } from '@nestjs/config';
import telemetryBootstrap from '@app/modules/telemetry/telemetry.boostrap';
import { HealthService } from '@app/modules/health';
import { telemetryMiddleware } from '@app/modules/telemetry/telemetry.middleware';
import { authMiddleware } from '@app/modules/auth/auth.middleware';
import { AuthAdapter } from '@app/modules/auth';
import { JobService } from '@app/modules/job';
import { LoggerService } from '@app/modules/logger';

import AppConfig, { AppMode } from './app.config';
import { AppModule } from './app.module';

declare const module: any;

function isNestApplication(
  obj: INestApplicationContext | INestApplication,
): obj is INestApplication {
  return !!(obj as INestApplication).useGlobalPipes;
}

export const registerMiddleware = (app: INestApplication): void => {
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(telemetryMiddleware);
  app.use(authMiddleware(app.get(AuthAdapter)));

  app.useLogger(app.get(LoggerService));
  app.flushLogs();

  const appConfig: ConfigType<typeof AppConfig> = app.get(AppConfig.KEY);
  app.setGlobalPrefix(appConfig.apiBaseRoute);
  // this is required for analyzing signatures of body payload in webhook guards
  app.use(
    json({
      verify(
        req: http.IncomingMessage,
        _res: http.ServerResponse,
        buf: Buffer,
      ) {
        if (Buffer.isBuffer(buf)) {
          (req as any).rawBody = buf;
        }
        return true;
      },
      limit: '5mb',
    }),
  );

  const orm = app.get(MikroORM);
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    (MikroOrmStorage as any).run(orm.em.fork(true, true), next);
  });
};

async function runAsJob(app: INestApplicationContext): Promise<void> {
  const jobService = app.get(JobService);
  let exitCode = 0;
  const log = await app.resolve(LoggerService);
  const jobName = process.env.RUN_JOB;
  if (!jobName) {
    throw new Error('RUN_JOB environment must be defined');
  }
  try {
    log.info(`Running job ${jobName}`);
    await jobService.run(jobName);
  } catch (error) {
    log.error({ error }, `Job ${jobName} failed`);
    exitCode = 1;
  } finally {
    await app.close();
    // eslint-disable-next-line no-process-exit
    process.exit(exitCode);
  }
}

async function runAsServer(app: INestApplicationContext): Promise<void> {
  const healthService = app.get(HealthService);
  healthService.registerShutdownHandler(async () => {
    const log = await app.resolve(LoggerService);
    log.info('Shutting down application');
    await app.close();
    log.info('Application successfully shutdown');
  });

  const appConfig: ConfigType<typeof AppConfig> = app.get(AppConfig.KEY);

  if (isNestApplication(app)) {
    registerMiddleware(app);
    if (appConfig.cors.origin) {
      app.enableCors(appConfig.cors);
    }

    await app.listen(appConfig.port, async () => {
      healthService.signalReady();
    });
    return;
  }

  healthService.signalReady();
}

const getApp = (): Promise<INestApplicationContext | INestApplication> => {
  switch (process.env.APP_MODE) {
    case AppMode.API:
    case AppMode.Hybrid:
      return NestFactory.create(AppModule, {
        bodyParser: false,
        bufferLogs: true,
      });
    case AppMode.Job:
    case AppMode.Worker:
    default:
      return NestFactory.createApplicationContext(AppModule);
  }
};

async function bootstrap(): Promise<void> {
  telemetryBootstrap(); // must happen before app creation

  const app = await getApp();

  const appConfig: ConfigType<typeof AppConfig> = app.get(AppConfig.KEY);

  // hot module reloading dev support
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  if (appConfig.mode === AppMode.Job) {
    return runAsJob(app);
  }

  await runAsServer(app);
}
bootstrap();
