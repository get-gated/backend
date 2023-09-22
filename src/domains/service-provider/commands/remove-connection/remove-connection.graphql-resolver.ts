import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { ConnectionRemovedTrigger } from '@app/interfaces/service-provider/service-provider.enums';

import ConnectionEntity from '../../entities/connection.entity';

import { UnlinkConnectionRequest } from './remove-connection.request.dto';
import { RemoveConnectionCommand } from './remove-connection.command';

@Resolver()
export class RemoveConnectionGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => ConnectionEntity)
  @Allow(Role.User)
  async connectionUnlink(
    @Args('input')
    { connectionId, reasonText, experienceText }: UnlinkConnectionRequest,
    @User() { userId }: AuthedUser,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ConnectionEntity> {
    await this.commandBus.execute(
      new RemoveConnectionCommand(
        userId,
        connectionId,
        ConnectionRemovedTrigger.User,
        reasonText,
        experienceText,
      ),
    );
    return loaders.connection.load(connectionId);
  }
}
