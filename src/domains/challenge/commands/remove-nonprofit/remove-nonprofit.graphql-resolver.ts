import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';

import { RemoveNonprofitCommand } from './remove-nonprofit.command';
import { NonprofitRemoveRequest } from './remove-nonprofit.request';

@Resolver()
export class RemoveNonprofitGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => Boolean)
  @Allow(Role.Admin)
  public async nonprofitRemove(
    @Args('input') { nonprofitId }: NonprofitRemoveRequest,
  ): Promise<boolean> {
    await this.commandBus.execute(new RemoveNonprofitCommand(nonprofitId));
    return true;
  }
}
