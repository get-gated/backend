import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EventBusService } from '@app/modules/event-bus';
import { LoggerService } from '@app/modules/logger';

import TxEmailEntity from '../../entities/tx-email.entity';
import UserSettingsEntity from '../../entities/user-settings.entity';
import NotificationConfig from '../../notification.config';
import { UserAppService } from '../../../user/user.app-service';
import { PaymentAppService } from '../../../payment/payment.app-service';
import ChallengeAppService from '../../../challenge/challenge.app-service';

import { SendGridToken } from './tx-email.adapter';
import { TxEmailService } from './tx-email.service';

const txEmailRepoMock = {
  findOne: jest.fn(),
};

const userSettingRepoMock = {
  findOne: jest.fn(),
};

const eventBusMock = {};

const sendgridMock = { setApiKey: jest.fn() };
const notificationConfigMock = { sendgrid: { apiKey: 'test' } };
const userServiceMock = {};
const paymentServiceMock = {};

describe('TxEmailService', () => {
  let service: TxEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TxEmailService,
        {
          provide: getRepositoryToken(TxEmailEntity),
          useValue: txEmailRepoMock,
        },
        {
          provide: getRepositoryToken(UserSettingsEntity),
          useValue: userSettingRepoMock,
        },
        {
          provide: EventBusService,
          useValue: eventBusMock,
        },
        {
          provide: SendGridToken,
          useValue: sendgridMock,
        },
        {
          provide: NotificationConfig.KEY,
          useValue: notificationConfigMock,
        },
        {
          provide: UserAppService,
          useValue: userServiceMock,
        },
        { provide: LoggerService, useValue: console },
        { provide: PaymentAppService, useValue: paymentServiceMock },
        { provide: ChallengeAppService, useValue: {} },
      ],
    }).compile();

    service = module.get<TxEmailService>(TxEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
