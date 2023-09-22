import { Global, Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { LoggerService } from '@app/modules/logger';
import { ConfigModule, ConfigType } from '@nestjs/config';

import AppConfig, { AppMode } from '../../app.config';

import { JobToken } from './job.decorator';
import { JobService } from './job.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(AppConfig)],
  providers: [JobService, DiscoveryService],
  exports: [JobService],
})
export class JobModule implements OnApplicationBootstrap {
  constructor(
    private readonly discovery: DiscoveryService,
    private reflector: Reflector,
    private jobService: JobService,
    private log: LoggerService,
    @Inject(AppConfig.KEY) private appConfig: ConfigType<typeof AppConfig>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.appConfig.mode !== AppMode.Job) return;
    const providers = this.discovery.getProviders();

    providers.forEach((wrapper) => {
      const target =
        !wrapper.metatype || wrapper.inject
          ? wrapper.instance?.constructor
          : wrapper.metatype;

      if (!target) return;

      const jobName = this.reflector.get(JobToken, target);
      if (jobName) {
        this.log.debug({ jobName }, 'Found Job Handler');
        this.jobService.registerJob(jobName, wrapper.instance);
      }
    });
  }
}
