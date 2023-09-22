import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';

import ConnectionEntity from '../../../service-provider/entities/connection.entity';
import ChallengeConnectionSettingEntity from '../../entities/connection-setting.entity';

import { ConnectionSettingsQuery } from './connection-settings.query';

@Resolver(() => ConnectionEntity)
export class ConnectionSettingsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @ResolveField(() => ChallengeConnectionSettingEntity)
  async challengeSettings(
    @Parent() parent: ConnectionEntity,
  ): Promise<ChallengeConnectionSettingEntity> {
    return this.queryBus.execute(
      new ConnectionSettingsQuery(parent.connectionId),
    );
  }
}
