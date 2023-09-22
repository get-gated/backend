import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';
import { LoggerService } from '@app/modules/logger';
import { AsyncContextService } from '@app/modules/async-context';

import ConnectionEntity from '../../entities/connection.entity';
import { ProviderService } from '../../services/provider/provider.service';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { ConnectionStatusCheckForInvalidJob } from './connection-status.check-for-invalid.job';

const commandBusMock = {
  execute: jest.fn(),
};

const connectionRepoMock = {
  find: jest.fn(),
};
const providerServiceMock = {
  isProviderTokenValid: jest.fn(),
};
const providerAdapter = new Proxy(
  {},
  {
    get() {
      return providerServiceMock;
    },
  },
);

const acMock = {
  register: jest.fn(),
};

describe('connection-status.check-for-invalid.job.ts', () => {
  let service: ConnectionStatusCheckForInvalidJob;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionStatusCheckForInvalidJob,
        { provide: CommandBus, useValue: commandBusMock },
        { provide: ConnectionRepository, useValue: connectionRepoMock },
        { provide: ProviderService, useValue: { adapters: providerAdapter } },
        { provide: LoggerService, useValue: console },
        { provide: AsyncContextService, useValue: acMock },
      ],
    }).compile();
    service = module.get<ConnectionStatusCheckForInvalidJob>(
      ConnectionStatusCheckForInvalidJob,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should mark connections as invalid that have bad tokens', async () => {
    const badConnection1: Partial<ConnectionEntity> = {
      status: Status.Running,
      connectionId: 'bad-1',
    };
    const badConnection2: Partial<ConnectionEntity> = {
      status: Status.Running,
      connectionId: 'bad-2',
    };
    const goodConnection1: Partial<ConnectionEntity> = {
      status: Status.Running,
      connectionId: 'good-1',
    };
    const goodConnection2: Partial<ConnectionEntity> = {
      status: Status.Running,
      connectionId: 'good-2',
    };
    let hasQueried = false;
    connectionRepoMock.find.mockImplementation(() => {
      if (hasQueried) return [];
      hasQueried = true;
      return [goodConnection1, badConnection1, goodConnection2, badConnection2];
    });

    providerServiceMock.isProviderTokenValid.mockImplementation(
      (connection: Partial<ConnectionEntity>) =>
        !connection?.connectionId?.includes('bad'),
    );
    await service.run();

    expect(commandBusMock.execute).toBeCalledTimes(2);

    const firstCall: Partial<ConnectionEntity> =
      commandBusMock.execute.mock.calls[0][0];
    const secondCall: Partial<ConnectionEntity> =
      commandBusMock.execute.mock.calls[1][0];

    expect(firstCall.connectionId).toEqual(badConnection1.connectionId);
    expect(firstCall.status).toEqual(Status.Invalid);
    expect(secondCall.connectionId).toEqual(badConnection2.connectionId);
    expect(secondCall.status).toEqual(Status.Invalid);
  });
});
