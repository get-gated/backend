import {
  Args,
  Context,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { IGraphqlContext } from '@app/modules/graphql';
import { Allow, Role } from '@app/modules/auth';

import HistoryMessageEntity from '../../entities/history-message.entity';
import ChallengeEntity from '../../../challenge/entities/challenge.entity';
import ConnectionEntity from '../../entities/connection.entity';

@Resolver(() => HistoryMessageEntity)
export class MessageGraphqlResolver {
  @Query(() => HistoryMessageEntity)
  @Allow(Role.User)
  async message(
    @Args('id', { type: () => ID }) messageId: string,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<HistoryMessageEntity> {
    return loaders.message.load(messageId);
  }

  @ResolveField()
  async connection(
    @Parent() { connectionId }: HistoryMessageEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ConnectionEntity> {
    return loaders.connection.load(connectionId);
  }
}

@Resolver(() => ChallengeEntity)
export class MessageForChallengeGraphqlResolver {
  @ResolveField()
  async message(
    @Parent() challenge: ChallengeEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<HistoryMessageEntity> {
    return loaders.message.load(challenge.messageId);
  }

  @ResolveField()
  async sentMessage(
    @Parent() { sentMessageId }: ChallengeEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<HistoryMessageEntity | null> {
    return sentMessageId ? loaders.message.load(sentMessageId) : null;
  }
}
