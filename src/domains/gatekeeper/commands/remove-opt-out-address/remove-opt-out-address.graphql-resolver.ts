import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';

import { RemoveOptOutAddressRequestDto } from './remove-opt-out-address.request.dto';
import { RemoveOptOutAddressCommand } from './remove-opt-out-address.command';

@Resolver()
export class RemoveOptOutAddressGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => Boolean)
  @Allow(Role.User)
  async optOutAddressRemove(
    @Args('input') args: RemoveOptOutAddressRequestDto,
    @User() { userId }: AuthedUser,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new RemoveOptOutAddressCommand(userId, args.optOutId),
    );
    return true;
  }
}
