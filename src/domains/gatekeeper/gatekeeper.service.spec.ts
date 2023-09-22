import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { DeepPartial, UtilsService } from '@app/modules/utils';
import { LoggerService } from '@app/modules/logger';
import { Rule, Verdict } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';
import { ConnectionCalendarEventInterface } from '@app/interfaces/service-provider/event.interface';

import { ServiceProviderAppService } from '../service-provider';

import { GatekeeperService } from './gatekeeper.service';
import { AllowedThreadEntity } from './entities/allowed-thread.entity';
import PatternRepository from './entities/repositories/pattern.repository';
import OptOutAddressEntity from './entities/opt-out-address.entity';
import TrainingRepository from './entities/repositories/training.repository';

const utilsMock = {
  normalizeEmail: (email: string) => ({
    email,
    username: 'x',
    domain: 'domain.com',
  }),
};

const patternServiceMock = {
  emailMatch: () => null,
};

const allowedThreadRepoMock = {
  persistAndFlush: jest.fn(),
  findOne: jest.fn(),
};

const optOutRepoMock = {
  findOne: () => null,
};

const serviceProviderMock: DeepPartial<ServiceProviderAppService> = {
  queryHasSentTo: () => false,
};

const trainingRepositoryMock = {
  findContactTraining: () => null,
  findDomainTraining: () => null,
};

const testMessage = {
  connectionId: 'test-connection-id',
  userId: 'test-user-id',
  from: {
    emailAddress: 'from@gmail.com',
    displayName: 'From Test',
  },
  to: [
    {
      emailAddress: 'to@gmail.com',
      displayName: 'To Test',
    },
  ],
  cc: [],
  bcc: [],
  replyTo: [],
  receivedAt: new Date(),
  type: MessageType.Received,
  messageId: 'test-message-id',
  wasSentBySystem: false,
  isMailingList: false,
  externalMessageId: 'test-external-message-id',
};

describe('GatekeeperService', () => {
  let service: GatekeeperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatekeeperService,
        {
          provide: PatternRepository,
          useValue: patternServiceMock,
        },
        {
          provide: getRepositoryToken(AllowedThreadEntity),
          useValue: allowedThreadRepoMock,
        },
        {
          provide: getRepositoryToken(OptOutAddressEntity),
          useValue: optOutRepoMock,
        },
        {
          provide: TrainingRepository,
          useValue: trainingRepositoryMock,
        },
        { provide: UtilsService, useValue: utilsMock },
        { provide: LoggerService, useValue: console },
        { provide: ServiceProviderAppService, useValue: serviceProviderMock },
      ],
    }).compile();

    service = module.get<GatekeeperService>(GatekeeperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluateMessage', () => {
    it('should allow messages with blank calendar events from user', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await service.evaluateMessage({
        ...testMessage,
        calendarEvent: new ConnectionCalendarEventInterface({
          isUserOrganizer: true,
          participants: [],
        }),
      });

      expect(result.verdict).toEqual(Verdict.CalenderRsvpUserOrganizerAllowed);
      expect(result.ruling).toEqual(Rule.Allow);
    });

    it('should allow messages with blank calendar events from others', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await service.evaluateMessage({
        ...testMessage,
        calendarEvent: new ConnectionCalendarEventInterface({
          isUserOrganizer: false,
          participants: [],
        }),
      });

      expect(result.verdict).toEqual(Verdict.CalendarEventAllowed);
      expect(result.ruling).toEqual(Rule.Allow);
    });
  });
});
