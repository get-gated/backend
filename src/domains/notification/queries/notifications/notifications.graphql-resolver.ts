import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { graphqlUtils, PageInfo, Pagination } from '@app/modules/graphql';
import { QueryOrder } from '@mikro-orm/core';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import UserEntity from '../../../user/entities/user.entity';

import { TNotificationsHandlerResponse } from './notifications.handler';
import { NotificationsQuery } from './notifications.query';
import {
  NotificationEdge,
  NotificationsResponse,
} from './notifications.response.dto';
import { NotificationsRequest } from './notifications.request.dto';

@Resolver(() => UserEntity)
export class NotificationsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  private async getNotifications(
    userId: string,
    pagination: Pagination = {},
  ): Promise<NotificationsResponse> {
    const {
      cursorValue,
      order = QueryOrder.DESC,
      limit = 50,
    } = graphqlUtils.paginationToPg(pagination);

    const {
      notifications,
      hasNextPage,
      hasPreviousPage,
      total,
    }: TNotificationsHandlerResponse = await this.queryBus.execute(
      new NotificationsQuery(
        userId,
        cursorValue ? new Date(cursorValue) : new Date(),
        order,
        limit,
      ),
    );

    const edges = notifications.map((notification) => {
      const cursor = graphqlUtils.encodeCursor(notification.sentAt.toString());
      return new NotificationEdge({ cursor, node: notification });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new NotificationsResponse({ edges, pageInfo });
  }

  @Query(() => NotificationsResponse, { name: 'notifications' })
  @Allow(Role.User)
  async notificationsForCurrentUser(
    @Args('input') input: NotificationsRequest,
    @User() user: AuthedUser,
  ): Promise<NotificationsResponse> {
    return this.getNotifications(user.userId, input.pagination);
  }

  @ResolveField(() => NotificationsResponse)
  async notifications(
    @Parent() parent: UserEntity,
    @Args('input') input: NotificationsRequest,
  ): Promise<NotificationsResponse> {
    return this.getNotifications(parent.userId, input.pagination);
  }
}
