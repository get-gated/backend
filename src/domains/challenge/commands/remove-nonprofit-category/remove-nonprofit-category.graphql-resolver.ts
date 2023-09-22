import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';

import { RemoveNonprofitCategoryCommand } from './remove-nonprofit-category.command';
import { NonprofitCategoryRemoveRequest } from './remove-nonprofit-category.request';

@Resolver()
export class RemoveNonprofitCategoryGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => Boolean)
  @Allow(Role.Admin)
  public async nonprofitCategoryRemove(
    @Args('input') { nonprofitCategoryId }: NonprofitCategoryRemoveRequest,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new RemoveNonprofitCategoryCommand(nonprofitCategoryId),
    );
    return true;
  }
}
