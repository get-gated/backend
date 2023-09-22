import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import OptOutAddressEntity from '../../entities/opt-out-address.entity';

import { AddOptOutAddressCommand } from './add-opt-out-address.command';
import { AddOptOutAddressRequestDto } from './add-opt-out-address.request.dto';

@Resolver()
export class AddOptOutAddressGraphqlResolver {
  constructor(
    private commandBus: CommandBus,
    @InjectRepository(OptOutAddressEntity)
    private optOutRepo: EntityRepository<OptOutAddressEntity>,
  ) {}

  @Mutation(() => OptOutAddressEntity)
  @Allow(Role.User)
  async optOutAddressAdd(
    @Args('input') args: AddOptOutAddressRequestDto,
    @User() { userId }: AuthedUser,
  ): Promise<OptOutAddressEntity> {
    const optOutId = await this.commandBus.execute(
      new AddOptOutAddressCommand(userId, args.emailAddress),
    );
    return this.optOutRepo.findOneOrFail(optOutId);
  }
}
