import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { AnalyticsService } from './services/analytics.service';
import { SegmentService } from './services/adapters/segment/segment.service';
import AnalyticsConfig from './analytics.config';
import { providers } from './commands';

@Module({
  imports: [CqrsModule, ConfigModule.forFeature(AnalyticsConfig)],
  providers: [AnalyticsService, SegmentService, ...providers],
})
export class AnalyticsModule {}
