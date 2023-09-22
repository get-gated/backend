import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';

import UserEntity from '../../../user/entities/user.entity';
import ConnectionEntity from '../../entities/connection.entity';

import { ConnectionsQuery } from './connections.query';

@Resolver(() => UserEntity)
export class ConnectionsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @ResolveField(() => [ConnectionEntity])
  async connections(@Parent() parent: UserEntity): Promise<ConnectionEntity> {
    return this.queryBus.execute(new ConnectionsQuery(parent.userId));
  }
}
