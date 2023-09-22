import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';

import { RemovePatternCommand } from './remove-pattern.command';
import { PatternRemoveRequest } from './remove-pattern.request';

@Resolver()
export class RemovePatternGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => Boolean)
  @Allow(Role.Admin)
  async patternRemove(
    @Args('input') { patternId }: PatternRemoveRequest,
  ): Promise<boolean> {
    await this.commandBus.execute(new RemovePatternCommand(patternId));
    return true;
  }
}
