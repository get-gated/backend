import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import PatternEntity from '../../entities/pattern.entity';

import { UpdatePatternRequest } from './update-pattern.request.dto';
import { UpdatePatternCommand } from './update-pattern.command';

@Resolver()
export class UpdatePatternGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => PatternEntity)
  @Allow(Role.Admin)
  async patternUpdate(
    @Args('input') args: UpdatePatternRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<PatternEntity> {
    await this.commandBus.execute(
      new UpdatePatternCommand(
        args.patternId,
        args.name,
        args.expression,
        args.rule,
        args.description,
      ),
    );
    return loaders.pattern.load(args.patternId);
  }
}
