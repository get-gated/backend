import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { IGraphqlContext } from '@app/modules/graphql';

import TrainingEntity from '../../entities/training.entity';

import { TrainDomainsCommand } from './train-domains.command';
import { TrainDomainsRequest } from './train-domains.request.dto';

@Resolver()
export class TrainDomainsGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => TrainingEntity)
  @Allow(Role.User)
  async trainDomain(
    @User() { userId }: AuthedUser,
    @Args('input') { domain, rule, origin }: TrainDomainsRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<TrainingEntity> {
    const result = await this.commandBus.execute(
      new TrainDomainsCommand(userId, [domain], rule, origin),
    );
    return loaders.training.load(result[0]);
  }
}
