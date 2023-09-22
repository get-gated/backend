import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthedUser, User } from '@app/modules/auth';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { QueryBus } from '@nestjs/cqrs';

import { VolumeStatEntity } from '../../../service-provider/entities/volume-stat.entity';

import { DecisionCountQuery } from './decision-count.query';

@Resolver(VolumeStatEntity)
export class DecisionCountVolumeStatGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @ResolveField()
  async gatedMessages(
    @Parent() { startAt, endAt }: VolumeStatEntity,
    @User() { userId }: AuthedUser,
  ): Promise<any> {
    return this.queryBus.execute(
      new DecisionCountQuery(userId, startAt, endAt, Rule.Gate),
    );
  }
}
