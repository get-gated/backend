import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '@app/modules/logger';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { AllowThreadReason } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { isUUID } from 'class-validator';

import { AllowedThreadEntity } from '../../entities/allowed-thread.entity';

import { AllowThreadCommandHandler } from './allow-thread.command-handler';

describe('Allow Thread Command Handler', () => {
  let service: AllowThreadCommandHandler;

  const allowedThreadRepoMock = {
    persistAndFlush: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllowThreadCommandHandler,
        {
          provide: getRepositoryToken(AllowedThreadEntity),
          useValue: allowedThreadRepoMock,
        },
        { provide: LoggerService, useValue: console },
      ],
    }).compile();

    service = module.get<AllowThreadCommandHandler>(AllowThreadCommandHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should abort if thread exists', async () => {
    allowedThreadRepoMock.findOne.mockResolvedValueOnce(
      new AllowedThreadEntity({
        threadId: '123',
        reason: AllowThreadReason.AllowedSenderStarted,
      }),
    );
    await service.execute({
      threadId: '123',
      reason: AllowThreadReason.AllowedSenderStarted,
    });
    expect(allowedThreadRepoMock.persistAndFlush).not.toBeCalled();
  });

  it("should create an entry for the thread if it doesn't exist", async () => {
    const threadId = '123';
    const reason = AllowThreadReason.AllowedSenderStarted;
    await service.execute({
      threadId,
      reason,
    });

    const arg = <AllowedThreadEntity>(
      allowedThreadRepoMock.persistAndFlush.mock.calls[0][0]
    );
    expect(arg).toBeInstanceOf(AllowedThreadEntity);
    expect(arg.threadId).toEqual(threadId);
    expect(arg.reason).toEqual(reason);
    expect(isUUID(arg.allowedThreadId)).toEqual(true);
  });
});
