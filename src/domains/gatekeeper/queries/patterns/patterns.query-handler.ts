import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { EntityData, QueryOrder } from '@mikro-orm/core';

import PatternEntity from '../../entities/pattern.entity';
import PatternRepository from '../../entities/repositories/pattern.repository';

import { PatternsQuery } from './patterns.query';

export interface TPatternsQueryResponse {
  patterns: PatternEntity[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

@QueryHandler(PatternsQuery)
export class PatternsQueryHandler implements IQueryHandler<PatternsQuery> {
  constructor(
    private patternRepo: PatternRepository,
    private readonly em: EntityManager,
  ) {}

  async execute(query: PatternsQuery): Promise<TPatternsQueryResponse> {
    const meta = this.em.getMetadata().get(PatternEntity.name);
    const knex = this.em.getKnex();
    const results = await knex
      .select('*')
      .from(meta.tableName)
      .whereNull('deleted_at')
      .modify((queryBuilder) => {
        if (query.filter?.test) {
          queryBuilder.andWhere(
            knex.raw(`? ~* CONCAT('^', "expression", '$')`, [
              query.filter.test,
            ]),
          );
        }
        if (query.filter?.search) {
          queryBuilder.andWhere(
            knex.raw(`("expression" ~* ? OR "description" ~* ?)`, [
              query.filter.search,
              query.filter.search,
            ]),
          );
        }
        if (query.since) {
          queryBuilder.andWhere('created_at', '<', query.since);
        }
        if (query.filter?.rule) {
          queryBuilder.andWhere('rule', 'IN', query.filter.rule);
        }
      })
      .orderBy('created_at', QueryOrder.DESC)
      .limit(query.limit + 1);

    const patterns = results.map((training: EntityData<PatternEntity>) =>
      this.em.map(PatternEntity, training),
    );

    let hasNextPage;
    if (patterns.length === query.limit + 1) {
      patterns.pop();
      hasNextPage = true;
    } else {
      hasNextPage = false;
    }

    let hasPreviousPage = false;
    if (query.since) {
      const otherDirectionResult = await this.patternRepo.findOne({
        createdAt: { $gt: query.since },
      });
      hasPreviousPage = Boolean(otherDirectionResult);
    }

    const [{ count: total }] = await await knex
      .count('*')
      .from(meta.tableName)
      .whereNull('deleted_at')
      .modify((queryBuilder) => {
        if (query.filter?.test) {
          queryBuilder.andWhere(
            knex.raw(`? ~* CONCAT('^', "expression", '$')`, [
              `(${query.filter.test})`,
            ]),
          );
        }
        if (query.filter?.search) {
          queryBuilder.andWhere(
            knex.raw(`("expression" ~* ? OR "description" ~* ?)`, [
              query.filter.search,
              query.filter.search,
            ]),
          );
        }
        if (query.filter?.rule) {
          queryBuilder.andWhere('rule', 'IN', query.filter.rule);
        }
      });

    return { hasPreviousPage, hasNextPage, patterns, total };
  }
}
