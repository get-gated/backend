import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';
import { EventBusService } from '@app/modules/event-bus';
import { v4 as uuidv4 } from 'uuid';
import { ConfigType } from '@nestjs/config';
import { EntityRepository } from '@mikro-orm/postgresql';
import { LoggerService } from '@app/modules/logger';

import ChallengeUserSettingEntity from '../../entities/user-setting.entity';
import { getOptions } from '../../../../../mikro-orm.config';
import entities from '../../entities';
import ChallengeConfig from '../../challenge.config';

import { UserSettingsHandler } from './user-settings.handler';

const challengeConfigMock: Partial<ConfigType<typeof ChallengeConfig>> = {
  defaultMinimumDonationAmount: 500,
};

const eventBusMock = {
  publish: jest.fn(),
};
describe('UserSettings Command Handler', () => {
  jest.setTimeout(20000);
  let service: UserSettingsHandler;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(getOptions()),
        MikroOrmModule.forFeature(entities),
      ],
      providers: [
        UserSettingsHandler,
        { provide: EventBusService, useValue: eventBusMock },
        { provide: LoggerService, useValue: console },
        { provide: ChallengeConfig.KEY, useValue: challengeConfigMock },
      ],
    }).compile();

    service = module.get<UserSettingsHandler>(UserSettingsHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert into the db successfully with minimal data', async () => {
    const userId = uuidv4();
    await service.execute({ userId, signature: 'joe' });
  });

  it('should use the default values when not set', async () => {
    const settingsRepo = module.get<
      EntityRepository<ChallengeUserSettingEntity>
    >(getRepositoryToken(ChallengeUserSettingEntity));

    jest.spyOn(settingsRepo, 'persistAndFlush');

    const signature = 'joe';
    const userId = uuidv4();
    await service.execute({ userId, signature });

    expect(settingsRepo.persistAndFlush).toBeCalledWith(
      expect.objectContaining({
        userId,
        minimumDonation: challengeConfigMock.defaultMinimumDonationAmount,
        signature,
      }),
    );
  });
});
