import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';
import { Allow, Role } from '@app/modules/auth';

import ConnectionEntity from '../../entities/connection.entity';

import { ActivateConnectionCommand } from './activate-connection.command';
import { ActivateConnectionRequest } from './activate-connection.request.dto';

@Resolver()
export class ActivateConnectionGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => ConnectionEntity)
  @Allow(Role.User)
  async connectionActivate(
    @Args('input') { connectionId }: ActivateConnectionRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ConnectionEntity> {
    await this.commandBus.execute(new ActivateConnectionCommand(connectionId));
    return loaders.connection.load(connectionId);
  }
}
