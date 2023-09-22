import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeConnectionSettingEntity from '../../entities/connection-setting.entity';

import { ConnectionSettingsQuery } from './connection-settings.query';

@QueryHandler(ConnectionSettingsQuery)
export class ConnectionSettingsQueryHandler
  implements IQueryHandler<ConnectionSettingsQuery>
{
  constructor(
    @InjectRepository(ChallengeConnectionSettingEntity)
    private settingRepo: EntityRepository<ChallengeConnectionSettingEntity>,
  ) {}

  async execute(
    query: ConnectionSettingsQuery,
  ): Promise<ChallengeConnectionSettingEntity> {
    return this.settingRepo.findOneOrFail({ connectionId: query.connectionId });
  }
}
