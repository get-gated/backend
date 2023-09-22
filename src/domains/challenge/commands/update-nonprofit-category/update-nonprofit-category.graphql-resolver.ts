import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';

import { UpdateNonprofitCategoryCommand } from './update-nonprofit-category.command';
import { UpdateNonprofitCategoryRequest } from './update-nonprofit-category.request.dto';

@Resolver()
export class UpdateNonprofitCategoryGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => NonprofitCategoryEntity)
  @Allow(Role.Admin)
  public async nonprofitCategoryUpdate(
    @Args('input') args: UpdateNonprofitCategoryRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<NonprofitCategoryEntity> {
    await this.commandBus.execute(
      new UpdateNonprofitCategoryCommand(
        args.nonprofitCategoryId,
        args.name,
        args.description ?? '',
      ),
    );
    return loaders.nonprofitCategory.load(args.nonprofitCategoryId);
  }
}
