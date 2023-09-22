import { Test, TestingModule } from '@nestjs/testing';

import { AnalyticsService } from './analytics.service';
import { SegmentService } from './adapters/segment/segment.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService, { provide: SegmentService, useValue: {} }],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
