import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import NonprofitEntity from '../../entities/nonprofit.entity';

import { SetDefaultNonprofitCommand } from './set-default-nonprofit.command';
import { SetDefaultNonprofitRequest } from './set-default-nonprofit.request.dto';
import { SetDefaultNonprofitResponse } from './set-default-nonprofit.response.dto';

@Resolver()
export class SetDefaultNonprofitGraphqlResolver {
  constructor(
    private commandBus: CommandBus,
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  @Mutation(() => SetDefaultNonprofitResponse)
  @Allow(Role.Admin)
  public async nonprofitSetDefault(
    @Args('input') args: SetDefaultNonprofitRequest,
  ): Promise<SetDefaultNonprofitResponse> {
    const nonprofitIds = await this.commandBus.execute(
      new SetDefaultNonprofitCommand(args.nonprofitId),
    );

    const nonprofits = await this.nonprofitRepo.find({
      nonprofitId: nonprofitIds,
    });

    return {
      nonprofits,
    };
  }
}
