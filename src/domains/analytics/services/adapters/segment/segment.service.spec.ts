import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '@app/modules/logger';
import { AsyncContextService } from '@app/modules/async-context';

import AnalyticsConfig from '../../../analytics.config';

import { SegmentService } from './segment.service';

describe('SegmentService', () => {
  let service: SegmentService;

  const configMock = { segment: { writeKey: 'test' } };

  const acMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SegmentService,
        { provide: AnalyticsConfig.KEY, useValue: configMock },
        { provide: LoggerService, useValue: console },
        { provide: AsyncContextService, useValue: acMock },
      ],
    }).compile();

    service = module.get<SegmentService>(SegmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
