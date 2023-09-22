import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ConnectionInterface } from '@app/interfaces/service-provider/connection.interface';

import { ServiceProviderAppService } from '../../../service-provider';
import UserRepository from '../../entities/repositories/user.repository';
import UserEntity from '../../entities/user.entity';

import { SearchUsersQuery } from './search-users.query';

@QueryHandler(SearchUsersQuery)
export class SearchUsersQueryHandler
  implements IQueryHandler<SearchUsersQuery>
{
  constructor(
    private serviceProvider: ServiceProviderAppService,
    private userRepo: UserRepository,
  ) {}

  async execute(query: SearchUsersQuery): Promise<UserEntity[]> {
    const connections: ConnectionInterface[] =
      await this.serviceProvider.querySearchConnections({ query: query.query });

    const uniqueUserIds = new Set(connections.map((item) => item.userId));

    return this.userRepo.find({
      $and: [{ userId: { $in: Array.from(uniqueUserIds) } }],
    });
  }
}
