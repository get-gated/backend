import { Mutation, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';

import { AcknowledgeCommand } from './acknowledge.command';

@Resolver()
export class AcknowledgeGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => Boolean)
  @Allow(Role.User)
  async notificationsAcknowledge(
    @User() { userId }: AuthedUser,
  ): Promise<boolean> {
    await this.commandBus.execute(new AcknowledgeCommand(userId));
    return true;
  }
}
