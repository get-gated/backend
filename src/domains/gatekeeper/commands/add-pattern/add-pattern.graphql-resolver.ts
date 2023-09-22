import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import PatternEntity from '../../entities/pattern.entity';

import { AddPatternRequest } from './add-pattern.request.dto';
import { AddPatternCommand } from './add-pattern.command';

@Resolver()
export class AddPatternGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => PatternEntity)
  @Allow(Role.Admin)
  async patternAdd(
    @Args('input') args: AddPatternRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<PatternEntity> {
    const patternId = await this.commandBus.execute(
      new AddPatternCommand(
        args.name,
        args.expression,
        args.rule,
        args.description,
      ),
    );
    return loaders.pattern.load(patternId);
  }
}
