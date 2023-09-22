import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import LoggerConfig from '@app/modules/logger/logger.config';
import { LoggerService } from '@app/modules/logger/logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from '@app/modules/logger/logger.interceptor';

@Global()
@Module({
  imports: [ConfigModule.forFeature(LoggerConfig)],
  providers: [
    LoggerService,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
