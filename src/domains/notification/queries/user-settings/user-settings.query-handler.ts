import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import UserSettingsEntity from '../../entities/user-settings.entity';

import { NotificationUserSettingsQuery } from './user-settings.query';

@QueryHandler(NotificationUserSettingsQuery)
export class UserSettingsQueryHandler
  implements IQueryHandler<NotificationUserSettingsQuery>
{
  constructor(
    @InjectRepository(UserSettingsEntity)
    private settingsRepo: EntityRepository<UserSettingsEntity>,
  ) {}

  async execute(
    query: NotificationUserSettingsQuery,
  ): Promise<UserSettingsEntity> {
    const { userId } = query;
    return this.settingsRepo.findOneOrFail({ userId });
  }
}
