import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';
import { LoggerService } from '@app/modules/logger';
import { EventBusService } from '@app/modules/event-bus';
import { Provider } from '@app/interfaces/service-provider/service-provider.enums';
import { getRepositoryToken } from '@mikro-orm/nestjs';

import { ProviderService } from '../../services/provider/provider.service';
import ConnectionLogEntity from '../../entities/connection-log.entity';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { AddConnectionCommand } from './add-connection.command';
import {
  AddConnectionCommandHandler,
  ConnectionInUseError,
} from './add-connection.command-handler';

describe('Add Connection Command Handler', () => {
  let service: AddConnectionCommandHandler;

  const entityManagerMock = {
    flush: jest.fn(),
  };
  const connectionRepoMock = {
    persist: jest.fn(),
    findOne: jest.fn(),
    upsertConnection: ConnectionRepository.prototype.upsertConnection,
  };
  const connectionLogRepoMock = {
    persist: jest.fn(),
  };
  const providerServiceMock = {
    checkGatedLabels: jest.fn(),
    setAccountMetaData: jest.fn(),
    disconnect: jest.fn(),
    connect: jest.fn(),
  };
  const eventBusMock = {
    publish: jest.fn(),
  };

  const providerAdapter = new Proxy(
    {},
    {
      get() {
        return providerServiceMock;
      },
    },
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddConnectionCommandHandler,
        {
          provide: EntityManager,
          useValue: entityManagerMock,
        },
        {
          provide: ConnectionRepository,
          useValue: connectionRepoMock,
        },
        {
          provide: EventBusService,
          useValue: eventBusMock,
        },
        {
          provide: getRepositoryToken(ConnectionLogEntity),
          useValue: connectionLogRepoMock,
        },
        { provide: ProviderService, useValue: { adapters: providerAdapter } },
        { provide: LoggerService, useValue: console },
      ],
    }).compile();

    service = module.get<AddConnectionCommandHandler>(
      AddConnectionCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should stop a user from adding a connection to an account that is already linked to another user', async () => {
    const EXTERNAL_ACCOUNT_ID = '1234';
    const USER_A = '5678';
    const USER_B = '9012';

    providerServiceMock.connect.mockResolvedValueOnce({
      emailAddress: '',
      externalAccountId: EXTERNAL_ACCOUNT_ID,
      externalAccessToken: '',
    });

    connectionRepoMock.findOne.mockResolvedValueOnce({
      externalAccessToken: '',
      emailAddress: '',
      providerUid: EXTERNAL_ACCOUNT_ID,
      externalAccountId: 'EXTERNAL_ACCOUNT_ID',
      userId: USER_A,
      isDisabled: false,
    });

    await expect(
      service.execute(
        new AddConnectionCommand(
          USER_B,
          EXTERNAL_ACCOUNT_ID,
          Provider.Google,
          '1234',
          '',
        ),
      ),
    ).rejects.toThrowError(ConnectionInUseError);
  });
});
