import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { QueryOrder } from '@mikro-orm/core';

import ConnectionLogEntity from '../../entities/connection-log.entity';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { ConnectionLogsQuery } from './connection-logs.query';

export interface TConnectionLogsQueryResponse {
  connectionLogs: ConnectionLogEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(ConnectionLogsQuery)
export class ConnectionLogsHandler
  implements IQueryHandler<ConnectionLogsQuery>
{
  constructor(
    @InjectRepository(ConnectionLogEntity)
    private connectionLogRepo: EntityRepository<ConnectionLogEntity>,
    private connectionRepo: ConnectionRepository,
  ) {}

  async execute(
    query: ConnectionLogsQuery,
  ): Promise<TConnectionLogsQueryResponse> {
    const { connectionId, since, order, limit } = query;

    const direction = order === QueryOrder.DESC ? '$lt' : '$gt';
    const oppositeDirection = order === QueryOrder.DESC ? '$gt' : '$lt';

    const connection = await this.connectionRepo.findOne({ connectionId });

    const connectionLogs = await this.connectionLogRepo.find(
      {
        connection,
        createdAt: { [direction]: since },
      },
      {
        limit: limit + 1,
        orderBy: { createdAt: order },
      },
    );

    let hasNextPage;

    if (connectionLogs.length === limit + 1) {
      connectionLogs.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const otherDirectionResult = await this.connectionLogRepo.findOne(
      {
        connection,
        createdAt: { [oppositeDirection]: since },
      },
      { fields: ['connectionLogId'] },
    );
    const hasPreviousPage = Boolean(otherDirectionResult);

    const total = await this.connectionLogRepo.count({ connection });

    return { connectionLogs, hasNextPage, hasPreviousPage, total };
  }
}
