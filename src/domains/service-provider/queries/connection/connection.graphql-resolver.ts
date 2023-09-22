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
import {
  Provider,
  Status,
} from '@app/interfaces/service-provider/service-provider.enums';
import { Allow, Role } from '@app/modules/auth';

import ConnectionEntity from '../../entities/connection.entity';
import HistoryMessageEntity from '../../entities/history-message.entity';
import ChallengeEntity from '../../../challenge/entities/challenge.entity';
import DecisionEntity from '../../../gatekeeper/entities/decision.entity';

interface TConnectionParent {
  connectionId: string;
}

@Resolver(() => ConnectionEntity)
export class ConnectionGraphqlResolver {
  @Query(() => ConnectionEntity)
  @Allow(Role.User)
  connection(
    @Args('id', { type: () => ID }) connectionId: string,
  ): TConnectionParent {
    return { connectionId };
  }

  @ResolveField()
  async emailAddress(
    @Parent() { connectionId }: TConnectionParent,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<string> {
    const { emailAddress } = await loaders.connection.load(connectionId);
    return emailAddress;
  }

  @ResolveField()
  async provider(
    @Parent() { connectionId }: TConnectionParent,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<Provider> {
    const { provider } = await loaders.connection.load(connectionId);
    return provider;
  }

  @ResolveField()
  async status(
    @Parent() { connectionId }: TConnectionParent,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<Status> {
    const { status } = await loaders.connection.load(connectionId);
    return status;
  }

  @ResolveField()
  async createdAt(
    @Parent() { connectionId }: TConnectionParent,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<Date> {
    const { createdAt } = await loaders.connection.load(connectionId);
    return createdAt;
  }
}

@Resolver(() => HistoryMessageEntity)
export class ConnectionForMessageGraphqlResolver {
  @ResolveField(() => ConnectionEntity)
  async connection(
    @Parent() parent: HistoryMessageEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ConnectionEntity> {
    return loaders.connection.load(parent.connectionId);
  }
}

@Resolver(() => ChallengeEntity)
export class ConnectionForChallengeGraphqlResolver {
  @ResolveField(() => ConnectionEntity)
  async connection(
    @Parent() parent: ChallengeEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ConnectionEntity> {
    return loaders.connection.load(parent.connectionId);
  }
}

@Resolver(() => DecisionEntity)
export class ConnectionForDecisionGraphqlResolver {
  @ResolveField(() => ConnectionEntity)
  async connection(
    @Parent() parent: DecisionEntity,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ConnectionEntity> {
    return loaders.connection.load(parent.connectionId);
  }
}
