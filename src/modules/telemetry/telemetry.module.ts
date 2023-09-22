import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { TelemetryService } from '@app/modules/telemetry/telemetry.service';
import { LoggerService } from '@app/modules/logger';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TelemetryInterceptor } from '@app/modules/telemetry/telemetry.interceptor';

@Global()
@Module({
  imports: [],
  providers: [
    TelemetryService,
    { provide: APP_INTERCEPTOR, useClass: TelemetryInterceptor },
  ],
  exports: [TelemetryService],
})
export class TelemetryModule implements OnApplicationShutdown {
  constructor(
    private tracingService: TelemetryService,
    private log: LoggerService,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    this.log.info('Shutting down TracingModule');
    await this.tracingService.stop();
    this.log.info('TracingModule successfully shutdown');
  }
}
