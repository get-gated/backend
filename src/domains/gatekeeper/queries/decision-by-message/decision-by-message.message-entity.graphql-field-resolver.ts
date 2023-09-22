import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';

import HistoryMessageEntity from '../../../service-provider/entities/history-message.entity';
import DecisionEntity from '../../entities/decision.entity';

import { DecisionByMessageQuery } from './decision-by-message.query';

@Resolver(() => HistoryMessageEntity)
export class DecisionByMessageMessageEntityGraphqlFieldResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @ResolveField(() => DecisionEntity)
  async decision(@Parent() parent: HistoryMessageEntity): Promise<any> {
    return this.queryBus.execute(new DecisionByMessageQuery(parent.messageId));
  }
}
