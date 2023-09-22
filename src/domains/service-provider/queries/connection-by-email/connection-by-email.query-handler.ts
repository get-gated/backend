import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UtilsService } from '@app/modules/utils';

import ConnectionRepository from '../../entities/repositories/connection.repository';

import { ConnectionByEmailQuery } from './connection-by-email.query';

@QueryHandler(ConnectionByEmailQuery)
export class ConnectionByEmailQueryHandler
  implements IQueryHandler<ConnectionByEmailQuery>
{
  constructor(
    private readonly connRepo: ConnectionRepository,
    private readonly utils: UtilsService,
  ) {}

  async execute(query: ConnectionByEmailQuery): Promise<any> {
    const emailAddress = this.utils.normalizeEmail(query.emailAddress).email;

    return this.connRepo.findOne({
      emailAddress,
      deletedAt: null,
    });
  }
}
