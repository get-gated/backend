import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import SentReceivedStatEntity from '../../entities/sent-received-stat.entity';

import { SentReceivedStatRequestDto } from './sent-received-stat.request.dto';
import { SentReceivedStatQuery } from './sent-received-stat.query';

@Resolver()
export class SentReceivedStatGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => SentReceivedStatEntity)
  @Allow(Role.User)
  async sentReceivedStat(
    @Args('input') { sender }: SentReceivedStatRequestDto,
    @User() { userId }: AuthedUser,
  ): Promise<SentReceivedStatEntity> {
    return this.queryBus.execute(new SentReceivedStatQuery(userId, sender));
  }
}
