import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import OptOutAddressEntity from '../../entities/opt-out-address.entity';

import { OptOutAddressesQuery } from './opt-out-addresses.query';

@QueryHandler(OptOutAddressesQuery)
export class OptOutAddressesQueryHandler
  implements IQueryHandler<OptOutAddressesQuery>
{
  constructor(
    @InjectRepository(OptOutAddressEntity)
    private optOutRepo: EntityRepository<OptOutAddressEntity>,
  ) {}

  async execute(query: OptOutAddressesQuery): Promise<OptOutAddressEntity[]> {
    return this.optOutRepo.find({ userId: query.userId, deletedAt: null });
  }
}
