import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';
import { Allow, Role } from '@app/modules/auth';

import ConnectionEntity from '../../entities/connection.entity';

import { DeactivateConnectionCommand } from './deactivate-connection.command';
import { DeactivateConnectionRequest } from './deactivate-connection.request.dto';

@Resolver()
export class DeactivateConnectionGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => ConnectionEntity)
  @Allow(Role.User)
  async connectionDeactivate(
    @Args('input') { connectionId }: DeactivateConnectionRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ConnectionEntity> {
    await this.commandBus.execute(
      new DeactivateConnectionCommand(connectionId),
    );
    return loaders.connection.load(connectionId);
  }
}
