import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';

import ConnectionEntity from '../../entities/connection.entity';
import SyncEntity from '../../entities/sync.entity';

import { ConnectionSyncsQuery } from './connection-syncs.query';

@Resolver(() => ConnectionEntity)
export class ConnectionSyncsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @ResolveField(() => [SyncEntity])
  async syncs(
    @Parent() { connectionId }: ConnectionEntity,
  ): Promise<SyncEntity[]> {
    return this.queryBus.execute(new ConnectionSyncsQuery(connectionId));
  }

  @ResolveField(() => Boolean)
  async isSyncing(
    @Parent() { connectionId }: ConnectionEntity,
  ): Promise<boolean> {
    // todo: this could be optimized to just query a count
    const results: SyncEntity[] = await this.queryBus.execute(
      new ConnectionSyncsQuery(connectionId),
    );
    const hasActive = Boolean(results.find((item) => !item.isFinished));

    return hasActive;
  }
}
