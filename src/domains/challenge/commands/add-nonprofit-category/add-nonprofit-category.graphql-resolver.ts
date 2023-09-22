import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';

import { AddNonprofitCategoryCommand } from './add-nonprofit-category.command';
import { AddNonprofitCategoryRequest } from './add-nonprofit-category.request.dto';

@Resolver()
export class AddNonprofitCategoryGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => NonprofitCategoryEntity)
  @Allow(Role.Admin)
  public async nonprofitCategoryAdd(
    @Args('input') args: AddNonprofitCategoryRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<NonprofitCategoryEntity> {
    const nonprofitCategoryId = await this.commandBus.execute(
      new AddNonprofitCategoryCommand(args.name, args.description ?? ''),
    );
    return loaders.nonprofitCategory.load(nonprofitCategoryId);
  }
}
