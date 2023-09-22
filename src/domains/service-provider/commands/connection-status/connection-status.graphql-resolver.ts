import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import ConnectionEntity from '../../entities/connection.entity';

import { ConnectionStatusRequestDto } from './connection-status.request.dto';
import { ConnectionStatusCommand } from './connection-status.command';

@Resolver()
export class ConnectionStatusGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => ConnectionEntity)
  @Allow(Role.Admin)
  public async connectionStatus(
    @Args('input') { connectionId, status }: ConnectionStatusRequestDto,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ConnectionEntity> {
    await this.commandBus.execute(
      new ConnectionStatusCommand(connectionId, status),
    );
    return loaders.connection.load(connectionId);
  }
}
