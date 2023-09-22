import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from '@app/modules/utils';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import {
  ChallengeAction,
  ChallengeMode,
  ChallengeWithholdReason,
} from '@app/interfaces/challenge/challenge.enums';
import { ChallengeActionEvent } from '@app/events/challenge/challenge-action.event';
import { EventBusService } from '@app/modules/event-bus';
import { LoggerService } from '@app/modules/logger';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

import ChallengeConnectionSettingEntity from '../entities/connection-setting.entity';
import ChallengeUserSettingEntity from '../entities/user-setting.entity';
import { ServiceProviderAppService } from '../../service-provider';
import { PaymentAppService } from '../../payment/payment.app-service';
import ChallengeInteractionEntity from '../entities/challenge-interaction.entity';
import ChallengeEntity from '../entities/challenge.entity';
import ChallengeConfig from '../challenge.config';

import { TemplatingService } from './templating.service';
import { ChallengeService } from './challenge.service';

const eventBusMock = {
  publish: jest.fn(),
};

const timeInMsMock = {
  secs: jest.fn(),
  mins: jest.fn(),
  days: jest.fn(),
};
const utilsMock = {
  createHash: jest.fn(),
  timeInMs: () => timeInMsMock,
  normalizeEmail: (email: string) => ({
    email,
    username: 'x',
    domain: 'domain.com',
  }),
};

const connectionSettingsRepoMock = {
  findOneOrFail: jest.fn().mockResolvedValue({ template: 'temp' }),
  findOne: jest.fn().mockResolvedValue({ template: 'temp' }),
};

const challengeInteractionRepoMock = {
  findOne: jest.fn(),
};

const userSettingsRepoMock = {
  findOneOrFail: jest.fn().mockResolvedValue({ nonprofit: 'temp' }),
};

const challengeRepoMock = {
  findOne: jest.fn().mockResolvedValue(null),
  persistAndFlush: jest.fn(),
};

const templatingServiceMock = {
  getTemplateFromRotation: jest.fn().mockResolvedValue({
    challengeTemplateId: '3fa03610-9ddc-429f-83c0-c684ebd24c93',
  }),
  renderChallengeForUser: jest.fn(),
};

const serviceProviderMock = {
  commandSendReply: jest.fn(),
};

const paymentMock = {
  toPaymentToken: jest.fn(),
};

const testChallenge = {
  userId: '3288a4cb-da93-4ac0-a549-f9b5f79017ae',
  messageId: 'f01738b1-a593-4dd6-9b96-966b89ba87b6',
  threadId: '1709e76c-4e0a-43a0-a707-2e53c777be4a',
  to: 'test@test.com',
  connectionId: '64248fc4-b45f-4ab2-b248-cb6ae8a702b7',
};

const testMessage = {
  messageId: testChallenge.messageId,
} as ConnectionEmailMessageInterface;

const challengeConfigMock = {
  challengeLimitPerSenderInHours: 24,
};

describe('EvaluateGatedSender Command repo', () => {
  let service: ChallengeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeService,
        { provide: LoggerService, useValue: console },
        { provide: EventBusService, useValue: eventBusMock },
        { provide: TemplatingService, useValue: templatingServiceMock },
        { provide: UtilsService, useValue: utilsMock },
        {
          provide: getRepositoryToken(ChallengeInteractionEntity),
          useValue: challengeInteractionRepoMock,
        },
        {
          provide: getRepositoryToken(ChallengeConnectionSettingEntity),
          useValue: connectionSettingsRepoMock,
        },
        {
          provide: getRepositoryToken(ChallengeUserSettingEntity),
          useValue: userSettingsRepoMock,
        },
        {
          provide: getRepositoryToken(ChallengeEntity),
          useValue: challengeRepoMock,
        },
        { provide: ServiceProviderAppService, useValue: serviceProviderMock },
        { provide: PaymentAppService, useValue: paymentMock },
        { provide: ChallengeConfig.KEY, useValue: challengeConfigMock },
      ],
    }).compile();

    service = module.get<ChallengeService>(ChallengeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processChallenge', () => {
    it('should return early if previously processed', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      service.previouslyProcessed = jest.fn().mockResolvedValueOnce(true);
      await service.processChallenge(testChallenge, testMessage);
      const unreachableCall = userSettingsRepoMock.findOneOrFail;
      expect(unreachableCall).not.toBeCalled();
    });

    it('should use the default template if one is not set in users connection settings', async () => {
      connectionSettingsRepoMock.findOneOrFail.mockResolvedValueOnce({
        template: null,
      });
      await service.processChallenge(testChallenge, testMessage);
      expect(templatingServiceMock.getTemplateFromRotation).toBeCalled();
    });
    it('should use the connection settings template if one is set for the user', async () => {
      connectionSettingsRepoMock.findOneOrFail.mockResolvedValueOnce({
        template: 'test',
      });
      await service.processChallenge(testChallenge, testMessage);
      expect(templatingServiceMock.getTemplateFromRotation).not.toBeCalled();
    });

    it('should withhold the challenge if connection settings disabled challenges', async () => {
      connectionSettingsRepoMock.findOneOrFail.mockResolvedValueOnce({
        mode: ChallengeMode.Disable,
      });
      await service.processChallenge(testChallenge, testMessage);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(challengeRepoMock.persistAndFlush.mock.calls[0][0].action).toEqual(
        ChallengeAction.Withhold,
      );
    });

    it('should withhold the challenge if recently challenged', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      service.maxChallengesPerSenderReached = async () => true;
      await service.processChallenge(testChallenge, testMessage);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(challengeRepoMock.persistAndFlush.mock.calls[0][0].action).toEqual(
        ChallengeAction.Withhold,
      );
      expect(
        challengeRepoMock.persistAndFlush.mock.calls[0][0].withholdReason,
      ).toEqual(ChallengeWithholdReason.RecentChallenge);
    });

    it('should withhold the challenge if message has calendar event created by user', async () => {
      const calEventMessage = {
        messageId: testChallenge.messageId,
        calendarEvent: {
          isUserOrganizer: true,
          participants: [],
        },
      } as unknown as ConnectionEmailMessageInterface;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      service.maxChallengesPerSenderReached = async () => false;
      await service.processChallenge(testChallenge, calEventMessage);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(challengeRepoMock.persistAndFlush.mock.calls[0][0].action).toEqual(
        ChallengeAction.Withhold,
      );
      expect(
        challengeRepoMock.persistAndFlush.mock.calls[0][0].withholdReason,
      ).toEqual(ChallengeWithholdReason.CalendarEvent);
    });

    it('should withhold the challenge if message has calendar event created by unknown sender', async () => {
      const calEventMessage = {
        messageId: testChallenge.messageId,
        calendarEvent: {
          isUserOrganizer: false,
          participants: [],
        },
      } as unknown as ConnectionEmailMessageInterface;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      service.maxChallengesPerSenderReached = async () => false;
      await service.processChallenge(testChallenge, calEventMessage);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(challengeRepoMock.persistAndFlush.mock.calls[0][0].action).toEqual(
        ChallengeAction.Withhold,
      );
      expect(
        challengeRepoMock.persistAndFlush.mock.calls[0][0].withholdReason,
      ).toEqual(ChallengeWithholdReason.CalendarEvent);
    });

    it('should present the challenge otherwise and record the sent message id', async () => {
      const expectedSentMessageId = '123';
      serviceProviderMock.commandSendReply.mockResolvedValueOnce(
        expectedSentMessageId,
      );
      await service.processChallenge(testChallenge, testMessage);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(challengeRepoMock.persistAndFlush.mock.calls[0][0]).toMatchObject({
        action: ChallengeAction.Present,
        sentMessageId: expectedSentMessageId,
      });
    });

    it('should send the challenge using the Service Provider', async () => {
      await service.processChallenge(testChallenge, testMessage);
      expect(
        serviceProviderMock.commandSendReply.mock.calls[0][0],
      ).toMatchObject({
        connectionId: testChallenge.connectionId,
        messageId: testChallenge.messageId,
        to: testChallenge.to,
      });
    });

    it('should publish a ChallengeAction event', async () => {
      await service.processChallenge(testChallenge, testMessage);
      expect(eventBusMock.publish.mock.calls[0][0]).toBeInstanceOf(
        ChallengeActionEvent,
      );
    });
  });
});
