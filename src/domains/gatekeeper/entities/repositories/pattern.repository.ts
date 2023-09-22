import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import PatternEntity from '../pattern.entity';

interface PatternMatch {
  patternId: string;
  rule: Rule;
}

@Repository(PatternEntity)
export default class PatternRepository extends EntityRepository<PatternEntity> {
  public async emailMatch(
    emailAddress: string,
  ): Promise<PatternMatch | undefined> {
    const meta = this.em.getMetadata().get(PatternEntity.name);
    const knex = this.em.getKnex();
    const patterns = await knex
      .select(['id', 'rule'])
      .from(meta.tableName)
      .whereNull('deleted_at')
      .andWhere(
        knex.raw(`? ~* CONCAT('^', "expression", '$')`, [emailAddress]),
      );

    if (!patterns || !patterns.length) {
      return;
    }

    const patternPriority = [Rule.Allow, Rule.Mute, Rule.Gate];

    let pattern;

    for (let i = 0; i < patternPriority.length; i++) {
      pattern = patterns.find(
        (record: PatternEntity) => record.rule === patternPriority[i],
      );
      if (pattern) break;
    }

    if (!pattern) {
      [pattern] = patterns;
    }

    const { id: patternId, rule } = pattern;

    return { patternId, rule };
  }
}
