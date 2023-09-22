import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { Allow, AuthedUser, SpecialRole, User } from '@app/modules/auth';
import { graphqlUtils, PageInfo } from '@app/modules/graphql';

import {
  SearchTrainingsQuery,
  SearchTrainingsType,
} from './search-trainings.query';
import { SearchTrainingsRequest } from './search-trainings.request.dto';
import { TSearchTrainingsQueryResponse } from './search-trainings.query-handler';
import {
  SearchTrainingsResponse,
  TrainingEdge,
} from './search-trainings.response.dto';

@Resolver()
export class SearchTrainingsGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => SearchTrainingsResponse)
  @Allow(SpecialRole.AllAuthenticated)
  public async trainingSearch(
    @User() { userId }: AuthedUser,
    @Args('input') input: SearchTrainingsRequest,
  ): Promise<SearchTrainingsResponse> {
    const { cursorValue, limit = 50 } = graphqlUtils.paginationToPg(
      input.pagination,
    );
    let offset = cursorValue ? Number(cursorValue) : 0;

    if (input.pagination?.before) {
      offset -= limit;
      if (offset < 0) offset = 0;
    } else if (input.pagination?.after) {
      offset++;
    }

    const type = input.onlyDomains ? SearchTrainingsType.Domains : input.type;

    const {
      trainings,
      hasPreviousPage,
      hasNextPage,
      total,
    }: TSearchTrainingsQueryResponse = await this.queryBus.execute(
      new SearchTrainingsQuery(
        userId,
        input.query,
        type,
        limit,
        offset,
        input.forDomain,
        input.filter?.rule,
      ),
    );

    const edges = trainings.map((training, index) => {
      const cursor = graphqlUtils.encodeCursor(String(offset + index));
      return new TrainingEdge({ cursor, node: training });
    });

    const pageInfo = new PageInfo({
      hasPreviousPage,
      hasNextPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      totalResults: total,
    });

    return new SearchTrainingsResponse({ edges, pageInfo });
  }
}
