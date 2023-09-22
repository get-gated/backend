import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import HistoryMessageEntity from '../../entities/history-message.entity';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { MessagesQuery } from './messages.query';

export interface TMessagesHandlerResponse {
  messages: HistoryMessageEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(MessagesQuery)
export class MessagesQueryHandler implements IQueryHandler<MessagesQuery> {
  constructor(
    @InjectRepository(HistoryMessageEntity)
    private messageRepo: EntityRepository<HistoryMessageEntity>,
    private connRepo: ConnectionRepository,
  ) {}

  async execute(query: MessagesQuery): Promise<TMessagesHandlerResponse> {
    const { userId, limit, offset, filter } = query;

    const where: FilterQuery<HistoryMessageEntity> = {
      userId,
    };

    if (query.filter?.email) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line dot-notation
      where['$or'] = [
        {
          from: {
            emailAddress: { $ilike: `%${query.filter.email}%` },
          },
        },
        {
          from: {
            displayName: { $ilike: `%${query.filter.email}%` },
          },
        },
      ];
    }

    if (filter?.type) {
      where.type = filter.type;
    }

    let firstConnAddedAt: Date | undefined;
    if (!filter?.after && !query.includePreGated) {
      const oldestConn = await this.connRepo.findOne(
        { userId: query.userId },
        { orderBy: { createdAt: QueryOrder.ASC } },
      );
      firstConnAddedAt = oldestConn?.createdAt;
    }

    // eslint-disable-next-line no-nested-ternary
    const after = filter?.after
      ? { receivedAt: { $gt: filter.after } }
      : firstConnAddedAt
      ? {
          receivedAt: { $gt: firstConnAddedAt },
        }
      : {};
    const before = filter?.before ? { receivedAt: { $lt: filter.before } } : {};

    if (filter?.after && filter?.before) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line dot-notation
      where['$and'] = [after, before];
    } else if (filter?.after) {
      Object.assign(where, after);
      Object.assign(where, before);
    }

    const messages = await this.messageRepo.find(where, {
      limit: limit + 1,
      offset,
      orderBy: { receivedAt: QueryOrder.DESC },
    });

    let hasNextPage;

    if (messages.length === limit + 1) {
      messages.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const hasPreviousPage = Boolean(offset);
    const total = await this.messageRepo.count(where);

    return { messages, hasPreviousPage, hasNextPage, total };
  }
}
