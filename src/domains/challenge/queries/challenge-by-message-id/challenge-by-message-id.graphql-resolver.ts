import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';

import DecisionEntity from '../../../gatekeeper/entities/decision.entity';
import ChallengeEntity from '../../entities/challenge.entity';
import HistoryMessageEntity from '../../../service-provider/entities/history-message.entity';

import { ChallengeByMessageIdQuery } from './challenge-by-message-id.query';

@Resolver(() => DecisionEntity)
export class ChallengeForDecisionGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @ResolveField(() => ChallengeEntity)
  async challenge(@Parent() parent: DecisionEntity): Promise<ChallengeEntity> {
    return this.queryBus.execute(
      new ChallengeByMessageIdQuery(parent.messageId),
    );
  }
}

@Resolver(() => HistoryMessageEntity)
export class ChallengeForMessageGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @ResolveField(() => ChallengeEntity)
  async challenge(@Parent() parent: DecisionEntity): Promise<ChallengeEntity> {
    return this.queryBus.execute(
      new ChallengeByMessageIdQuery(parent.messageId),
    );
  }
}
