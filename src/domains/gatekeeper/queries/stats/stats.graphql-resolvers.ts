import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, SpecialRole, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import { Stats, StatsResponse } from './stats.response.dto';
import { StatsQuery } from './stats.query';
import { TStatsHandlerResponse } from './stats.query-handler';

interface ParentType {
  userId: string;
}

@Resolver(() => StatsResponse)
export class StatsGraphqlResolvers {
  constructor(private queryBus: QueryBus) {}

  private async execute(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Stats> {
    const stats: TStatsHandlerResponse = await this.queryBus.execute(
      new StatsQuery(userId, startDate, endDate),
    );

    return {
      allowedCount: stats.allowed + stats.ignored,
      gatedCount: stats.muted + stats.gated,
      totalCount: stats.total,
    };
  }

  @Query(() => StatsResponse)
  @Allow(SpecialRole.AllAuthenticated)
  stats(@User() user: AuthedUser): ParentType {
    return {
      userId: user.userId,
    }; // everything will be resolved my field resolvers
  }

  @ResolveField(() => Stats)
  async lastThirtyDays(@Parent() { userId }: ParentType): Promise<Stats> {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = now;
    return this.execute(userId, startDate, endDate);
  }

  @ResolveField(() => Stats)
  async previousThirtyDays(@Parent() { userId }: ParentType): Promise<Stats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 60);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 30);
    return this.execute(userId, startDate, endDate);
  }

  @ResolveField(() => Stats)
  async monthToDate(@Parent() { userId }: ParentType): Promise<Stats> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = now;
    return this.execute(userId, startDate, endDate);
  }

  @ResolveField(() => Stats)
  async lastMonth(@Parent() { userId }: ParentType): Promise<Stats> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const startDate = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1,
    );
    const endDate = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0,
      24,
      59,
      59,
      999,
    );
    return this.execute(userId, startDate, endDate);
  }

  @ResolveField(() => Stats)
  async yearToDate(@Parent() { userId }: ParentType): Promise<Stats> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 1, 1);
    const endDate = now;
    return this.queryBus.execute(new StatsQuery(userId, startDate, endDate));
  }

  @ResolveField(() => Stats)
  async allTime(@Parent() { userId }: ParentType): Promise<Stats> {
    const now = new Date();
    const startDate = new Date(2020, 1, 1);
    const endDate = now;
    return this.execute(userId, startDate, endDate);
  }
}
