import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeUserSettingEntity from '../../entities/user-setting.entity';
import NonprofitEntity from '../../entities/nonprofit.entity';

import { ChallengeUserSettingsQuery } from './user-settings.query';

@QueryHandler(ChallengeUserSettingsQuery)
export class UserSettingsQueryHandler
  implements IQueryHandler<ChallengeUserSettingsQuery>
{
  constructor(
    @InjectRepository(ChallengeUserSettingEntity)
    private settingRepo: EntityRepository<ChallengeUserSettingEntity>,
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  async execute(
    query: ChallengeUserSettingsQuery,
  ): Promise<ChallengeUserSettingEntity> {
    const { userId } = query;
    const settings = await this.settingRepo.findOneOrFail(
      { userId },
      { populate: ['nonprofit'] },
    );

    if (!settings.nonprofit) {
      settings.nonprofit = await this.nonprofitRepo.findOneOrFail({
        isDefault: true,
      });
    }

    return settings;
  }
}
