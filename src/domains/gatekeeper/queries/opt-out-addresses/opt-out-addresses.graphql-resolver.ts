import { Query, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import OptOutAddressEntity from '../../entities/opt-out-address.entity';

import { OptOutAddressesQuery } from './opt-out-addresses.query';

@Resolver()
export class OptOutAddressesGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => [OptOutAddressEntity])
  @Allow(Role.User)
  async optOutAddresses(
    @User() { userId }: AuthedUser,
  ): Promise<OptOutAddressEntity[]> {
    return this.queryBus.execute(new OptOutAddressesQuery(userId));
  }
}
