import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';

import OptOutAddressEntity from '../../entities/opt-out-address.entity';
import UserEntity from '../../../user/entities/user.entity';

import { OptOutAddressesQuery } from './opt-out-addresses.query';

@Resolver(() => UserEntity)
export class OptOutAddressesUserGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @ResolveField(() => [OptOutAddressEntity])
  async optOutAddresses(
    @Parent() parent: UserEntity,
  ): Promise<OptOutAddressEntity[]> {
    return this.queryBus.execute(new OptOutAddressesQuery(parent.userId));
  }
}
