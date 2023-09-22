import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotificationsQuery } from './notifications.query';
import TxEmailEntity from '../../entities/tx-email.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

export type TNotificationsHandlerResponse = {
  notifications: TxEmailEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
};

@QueryHandler(NotificationsQuery)
export class NotificationsHandler implements IQueryHandler<NotificationsQuery> {
  constructor(
    @InjectRepository(TxEmailEntity)
    private txEmailRepo: EntityRepository<TxEmailEntity>,
  ) {}
  async execute(
    query: NotificationsQuery,
  ): Promise<TNotificationsHandlerResponse> {
    const { userId, since, order, limit } = query;

    const direction = order === QueryOrder.DESC ? '$lt' : '$gt';
    const oppositeDirection = order === QueryOrder.DESC ? '$gt' : '$lt';
    const notifications = await this.txEmailRepo.find(
      {
        userId,
        sentAt: { [direction]: since },
      },
      {
        limit: limit + 1,
        orderBy: { sentAt: order },
      },
    );

    let hasNextPage;

    if (notifications.length === limit + 1) {
      notifications.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const otherDirectionResult = await this.txEmailRepo.findOne(
      {
        userId,
        sentAt: { [oppositeDirection]: since },
      },
      { fields: ['notificationId'] },
    );

    const hasPreviousPage = Boolean(otherDirectionResult);

    const total = await this.txEmailRepo.count({ userId });

    return { notifications, hasPreviousPage, hasNextPage, total };
  }
}
