import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import PatternRepository from '../../entities/repositories/pattern.repository';
import PatternEntity from '../../entities/pattern.entity';

import { PatternQuery } from './pattern.query';

@QueryHandler(PatternQuery)
export class PatternQueryHandler implements IQueryHandler<PatternQuery> {
  constructor(private patternRepo: PatternRepository) {}

  async execute(query: PatternQuery): Promise<PatternEntity[]> {
    return this.patternRepo.find({
      patternId: { $in: query.patternIds },
    });
  }
}
