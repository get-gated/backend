import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { IGraphqlContext } from '@app/modules/graphql';

import TrainingEntity from '../../entities/training.entity';

import { TrainAddressesCommand } from './train-addresses.command';
import { TrainAddressesRequest } from './train-addresses.request.dto';

@Resolver()
export class TrainAddressesGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => TrainingEntity)
  @Allow(Role.User)
  async trainAddress(
    @User() { userId }: AuthedUser,
    @Args('input') { emailAddress, rule, origin }: TrainAddressesRequest,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<TrainingEntity> {
    const result = await this.commandBus.execute(
      new TrainAddressesCommand(userId, [emailAddress], rule, origin),
    );
    return loaders.training.load(result[0]);
  }
}
