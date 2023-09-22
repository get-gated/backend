import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { CACHE_MANAGER } from '@nestjs/common';
import { LoggerService } from '@app/modules/logger';
import {
  ConnectionRemovedTrigger,
  Provider,
  Status,
} from '@app/interfaces/service-provider/service-provider.enums';
import { ConnectionRemovedEvent } from '@app/events/service-provider/connection-removed.event';

import { TxEmailService } from '../../services/tx-email/tx-email.service';

import SendTxEmailConnectionRemovedEventHandler from './send-tx-email.connection-removed.event-handler';

const event: Partial<ConnectionRemovedEvent> = {
  reasonText: 'test-reason-text',
  experienceText: 'test-experience-text',
  connectionId: 'xxxxxxxx-test-test-test-connectionid',
  userId: 'xxxxxxxx-test-test-test-userid000001',
  emailAddress: 'test@gmail.com',
  provider: Provider.Google,
  status: Status.Running,
  isActivated: true,
  isDisabled: false,
};

const commandBusMock = {
  execute: jest.fn(),
};

const txEmailServiceMock = {
  getVariables: jest.fn().mockResolvedValue(event.userId),
};

const cacheManagerMock = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn(),
  del: jest.fn(),
};

describe('SendTxEmail ConnectionRemovedEvent Handler', () => {
  let service: SendTxEmailConnectionRemovedEventHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendTxEmailConnectionRemovedEventHandler,
        { provide: CommandBus, useValue: commandBusMock },
        { provide: TxEmailService, useValue: txEmailServiceMock },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
        { provide: LoggerService, useValue: console },
      ],
    }).compile();

    service = module.get<SendTxEmailConnectionRemovedEventHandler>(
      SendTxEmailConnectionRemovedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const callHandler = async (connectionEvent: any): Promise<any> =>
    service.handler(connectionEvent);
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send connection removed if the event was triggered by the user', async () => {
    await callHandler({
      ...event,
      trigger: ConnectionRemovedTrigger.User,
    });
    expect(commandBusMock.execute).toBeCalled();
    expect(commandBusMock.execute.mock.calls[0][0].transaction).toEqual(
      'CONNECTION_REMOVED',
    );
  });

  it('should not send if the event was triggered by account deletion', async () => {
    await callHandler({
      ...event,
      trigger: ConnectionRemovedTrigger.AccountRemoval,
    });
    expect(commandBusMock.execute).not.toBeCalled();
  });
});
