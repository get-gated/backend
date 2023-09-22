import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import UserNetworkConnectionEntity from '../../entities/network-connection.entity';

import { NetworkConnectionStatsQuery } from './network-connection-stats.query';
import { NetworkConnectionStatsResponseDto } from './network-connection-stats.response.dto';

@QueryHandler(NetworkConnectionStatsQuery)
export class NetworkConnectionStatsQueryHandler
  implements
    IQueryHandler<
      NetworkConnectionStatsQuery,
      NetworkConnectionStatsResponseDto
    >
{
  constructor(
    @InjectRepository(UserNetworkConnectionEntity)
    private networkConnRepo: EntityRepository<UserNetworkConnectionEntity>,
  ) {}

  async execute(query: NetworkConnectionStatsQuery): Promise<any> {
    const { userId } = query;
    const allKnown = await this.networkConnRepo.count({ userId });

    const usingGated = await this.networkConnRepo.count({
      userId,
      gatedUser: { disabledAt: null, userId: { $ne: null } },
    });
    const metWithGated = await this.networkConnRepo.count({
      userId,
      metWithGated: true,
    });

    return { allKnown, usingGated, metWithGated };
  }
}
