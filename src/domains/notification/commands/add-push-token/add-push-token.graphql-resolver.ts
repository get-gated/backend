import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';

import { AddPushTokenRequestDto } from './add-push-token.request.dto';
import { AddPushTokenCommand } from './add-push-token.command';

@Resolver()
export class AddPushTokenGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => Boolean)
  @Allow(Role.User)
  async notificationAddPushToken(
    @Args('input') { token, device }: AddPushTokenRequestDto,
    @User() { userId }: AuthedUser,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new AddPushTokenCommand(userId, token, device),
    );
    return true;
  }
}
