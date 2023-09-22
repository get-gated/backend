import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeEntity from '../../entities/challenge.entity';

import { ChallengeQuery } from './challenge.query';

@QueryHandler(ChallengeQuery)
export class ChallengeHandler implements IQueryHandler<ChallengeQuery> {
  constructor(
    @InjectRepository(ChallengeEntity)
    private challengeRepo: EntityRepository<ChallengeEntity>,
  ) {}

  async execute(query: ChallengeQuery): Promise<ChallengeEntity[]> {
    return this.challengeRepo.find({
      challengeId: { $in: query.challengeIds },
    });
  }
}
