import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/modules/logger/logger.module';

import AppConfig from '../../app.config';

import { UtilsService } from './utils.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(AppConfig), LoggerModule],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
