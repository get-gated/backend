import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import HealthConfig from './health.config';
import { HealthService } from './health.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(HealthConfig)],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
