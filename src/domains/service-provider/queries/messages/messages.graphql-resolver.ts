import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { graphqlUtils, PageInfo, Pagination } from '@app/modules/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';

import { TMessagesHandlerResponse } from './messages.query-handler';
import { MessagesQuery } from './messages.query';
import { MessageEdge, MessagesResponse } from './messages.response.dto';
import { MessagesRequest, MessagesRequestFilter } from './messages.request.dto';

@Resolver()
export class MessagesGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  private async getMessages(
    userId: string,
    // eslint-disable-next-line default-param-last
    pagination: Pagination = {},
    filter?: MessagesRequestFilter,
  ): Promise<MessagesResponse> {
    const { cursorValue, limit = 50 } = graphqlUtils.paginationToPg(pagination);

    let offset = cursorValue ? Number(cursorValue) : 0;

    if (pagination?.before) {
      offset -= limit;
      if (offset < 0) offset = 0;
    } else if (pagination?.after) {
      offset++;
    }

    const {
      messages,
      hasNextPage,
      hasPreviousPage,
      total,
    }: TMessagesHandlerResponse = await this.queryBus.execute(
      new MessagesQuery(userId, limit, offset, filter),
    );

    const edges = messages.map((message, index) => {
      const cursor = graphqlUtils.encodeCursor(String(offset + index));
      return new MessageEdge({ cursor, node: message });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new MessagesResponse({ edges, pageInfo });
  }

  @Query(() => MessagesResponse)
  @Allow(Role.User)
  async messages(
    @Args('input') input: MessagesRequest,
    @User() user: AuthedUser,
  ): Promise<MessagesResponse> {
    const { userId } = user;
    const { pagination, filter } = input;
    return this.getMessages(userId, pagination, filter);
  }
}
