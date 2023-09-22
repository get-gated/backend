import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from '@app/modules/utils';
import { CACHE_MANAGER } from '@nestjs/common';
import { LoggerService } from '@app/modules/logger';
import { TelemetryService } from '@app/modules/telemetry';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

import { ChallengeService } from '../../services/challenge.service';

import { EvaluateGatedSenderHandler } from './evaluate-gated-sender.handler';

const timeInMsMock = {
  secs: jest.fn(),
  mins: jest.fn(),
  days: jest.fn(),
};
const utilsMock = {
  createHash: jest.fn(),
  timeInMs: () => timeInMsMock,
};

const cacheManagerMock = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn(),
  del: jest.fn(),
};

const challengeServiceMock = {
  processChallenge: jest.fn(),
};

const testCommand = {
  userId: '3288a4cb-da93-4ac0-a549-f9b5f79017ae',
  message: {
    messageId: 'f01738b1-a593-4dd6-9b96-966b89ba87b6',
  } as ConnectionEmailMessageInterface,
  threadId: '1709e76c-4e0a-43a0-a707-2e53c777be4a',
  to: 'test@test.com',
  connectionId: '64248fc4-b45f-4ab2-b248-cb6ae8a702b7',
};

const metricCounterMock = {
  add: jest.fn(),
};
const telemetryMock = {
  getMetricCounter: () => metricCounterMock,
  addSpanEvent: jest.fn(),
};

describe('EvaluateGatedSender Command Handler', () => {
  let handler: EvaluateGatedSenderHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluateGatedSenderHandler,
        { provide: LoggerService, useValue: console },

        { provide: UtilsService, useValue: utilsMock },
        {
          provide: ChallengeService,
          useValue: challengeServiceMock,
        },

        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
        { provide: TelemetryService, useValue: telemetryMock },
      ],
    }).compile();

    handler = module.get<EvaluateGatedSenderHandler>(
      EvaluateGatedSenderHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call processChallenge with the right params', async () => {
    await handler.execute(testCommand);
    const expectedChallenge = {
      ...testCommand,
      messageId: testCommand.message.messageId,
    };
    delete (expectedChallenge as any).message;

    expect(challengeServiceMock.processChallenge).toBeCalledWith(
      expectedChallenge,
      testCommand.message,
    );
  });

  it('should reject if inflight', async () => {
    cacheManagerMock.get.mockResolvedValueOnce('test');
    const execution = handler.execute(testCommand);
    return expect(execution).rejects.toThrow(/.*Inflight.*/);
  });

  it('should set and del processing cache appropriately', async () => {
    const cacheKey = '123';
    utilsMock.createHash.mockReturnValueOnce(cacheKey);

    await handler.execute(testCommand);

    // cache key set appropriately
    expect(cacheManagerMock.set.mock.calls[0][0]).toEqual(cacheKey);

    // cache released appropriately
    expect(cacheManagerMock.del.mock.calls[0][0]).toEqual(cacheKey);
  });
});
