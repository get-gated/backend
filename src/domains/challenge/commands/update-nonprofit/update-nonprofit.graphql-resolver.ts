import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import NonprofitEntity from '../../entities/nonprofit.entity';

import { UpdateNonprofitRequest } from './update-nonprofit.request.dto';
import { UpdateNonprofitCommand } from './update-nonprofit.command';

@Resolver()
export class UpdateNonprofitGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => NonprofitEntity)
  @Allow(Role.Admin)
  public async nonprofitUpdate(
    @Args('input') args: UpdateNonprofitRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<NonprofitEntity> {
    await this.commandBus.execute(
      new UpdateNonprofitCommand(
        args.nonprofitId,
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
    return loaders.nonprofit.load(args.nonprofitId);
  }
}
