import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import NonprofitEntity from '../../entities/nonprofit.entity';

import { AddNonprofitRequest } from './add-nonprofit.request.dto';
import { AddNonprofitCommand } from './add-nonprofit.command';

@Resolver()
export class AddNonprofitGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => NonprofitEntity)
  @Allow(Role.Admin)
  public async nonprofitAdd(
    @Args('input') args: AddNonprofitRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<NonprofitEntity> {
    const nonprofitId = await this.commandBus.execute(
      new AddNonprofitCommand(
        args.name,
        args.description ?? '',
        args.categoryId,
        args.isDisplayed,
        args.logo,
        args.externalId,
        args.ein,
        args.url,
      ),
    );
    return loaders.nonprofit.load(nonprofitId);
  }
}
