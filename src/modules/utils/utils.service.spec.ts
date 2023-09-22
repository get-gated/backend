import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@app/interfaces/service-provider/service-provider.enums';
import { LoggerService } from '@app/modules/logger';

import AppConfig from '../../app.config';

import { UtilsService } from './utils.service';

const appConfigMock = {
  public: {
    protocol: 'https',
  },
};

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilsService,
        { provide: AppConfig.KEY, useValue: appConfigMock },
        { provide: LoggerService, useValue: console },
      ],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should detect if emails are present in a list', () => {
    const list = [
      { emailAddress: 'JoE+123@gmail.com', displayName: 'Joe' },
      { emailAddress: 'UsEr+Abc@corp.com', displayName: 'Abc Man' },
    ];
    const matchEmails = ['useR@corp.com'];
    const noMatchEmails = ['joey@gmail.com', 'cow@pasture.com'];

    const match = service.isEmailInParticipants(
      list,
      matchEmails,
      Provider.Google,
    );

    const noMatch = service.isEmailInParticipants(
      list,
      noMatchEmails,
      Provider.Google,
    );

    const noMatchEmpty = service.isEmailInParticipants(
      list,
      [],
      Provider.Google,
    );

    expect(match).toEqual(true);
    expect(noMatch).toEqual(false);
    expect(noMatchEmpty).toEqual(false);
  });
});
