import { Injectable } from '@nestjs/common';

import { SegmentService } from './adapters/segment/segment.service';
import { AnalyticsAdapterCollectionInterface } from './adapters/adapter.interface';

@Injectable()
export class AnalyticsService {
  public adapters: AnalyticsAdapterCollectionInterface;

  constructor(segment: SegmentService) {
    this.adapters = Object.freeze({
      segment,
    });
  }
}
