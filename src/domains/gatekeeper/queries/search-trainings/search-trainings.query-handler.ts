import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { QueryOrder } from '@mikro-orm/core';
import { UtilsService } from '@app/modules/utils';
// current version of knex used does not have type definitions
// eslint-disable-next-line import/no-extraneous-dependencies
import { QueryBuilder } from 'knex';

import TrainingEntity from '../../entities/training.entity';

import {
  SearchTrainingsQuery,
  SearchTrainingsType,
} from './search-trainings.query';

export interface TSearchTrainingsQueryResponse {
  trainings: TrainingEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(SearchTrainingsQuery)
export class SearchTrainingsQueryHandler
  implements IQueryHandler<SearchTrainingsQuery>
{
  constructor(
    private utils: UtilsService,
    private readonly em: EntityManager,
  ) {}

  async execute(
    query: SearchTrainingsQuery,
  ): Promise<TSearchTrainingsQueryResponse> {
    const meta = this.em.getMetadata().get(TrainingEntity.name);
    const knex = this.em.getKnex();
    let where: any = {};

    if (query.query) {
      if (query.type === SearchTrainingsType.Domains) {
        where = function () {
          knex
            .where(knex.raw('"domain" ~* ?', [`(${query.query})`]))
            .whereNull('username');
        };
      } else {
        const { username, domain } = this.utils.normalizeEmail(query.query);
        const usernameSearch = knex.raw('"username" ~* ?', [`(${username})`]);
        const domainSearch = knex.raw('"domain" ~* ?', [
          `(${domain || username || ''})`,
        ]);
        if (username && domain) {
          where = function () {
            knex.where(usernameSearch).andWhere(domainSearch);
          };
        } else {
          where = function () {
            knex.where(usernameSearch).orWhere(domainSearch);
          };
        }
      }
    }

    const makeQuery = (): QueryBuilder => {
      const q = knex
        .from(meta.tableName)
        .where(where)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .andWhere({ user_id: query.userId });

      if (query.rule) {
        q.andWhere({ rule: query.rule });
      }

      if (query.forDomain) {
        q.andWhere({ domain: query.forDomain.toLowerCase() });
        q.whereNotNull('username');
      }

      if (query.type === SearchTrainingsType.Domains) {
        q.whereNull('username');
      } else if (query.type === SearchTrainingsType.Addresses) {
        q.whereNotNull('username');
      }

      return q;
    };

    const results = await makeQuery()
      .select(knex.raw('distinct on ("username", "domain") *'))
      .limit(query.limit + 1)
      .offset(query.offset ?? 0)
      .orderBy('username', QueryOrder.ASC)
      .orderBy('domain', QueryOrder.ASC)
      // is required to sort identical records
      .orderBy('created_at', QueryOrder.DESC);

    const trainings = results.map((training: any) =>
      this.em.map(TrainingEntity, training),
    );

    let hasNextPage;
    if (trainings.length === query.limit + 1) {
      trainings.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    const [result] = await makeQuery().count(
      knex.raw('distinct("username", "domain")'),
    );

    const total = result?.count || 0;
    const hasPreviousPage = Boolean(query.offset);

    return { hasPreviousPage, hasNextPage, trainings, total };
  }
}
