import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeTemplateEntity from '../../entities/template.entity';

import { ChallengeTemplateQuery } from './challenge-template.query';

@QueryHandler(ChallengeTemplateQuery)
export class ChallengeTemplateQueryHandler
  implements IQueryHandler<ChallengeTemplateQuery>
{
  constructor(
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
  ) {}

  async execute(
    query: ChallengeTemplateQuery,
  ): Promise<ChallengeTemplateEntity[]> {
    return this.templateRepo.find({
      challengeTemplateId: { $in: query.challengeTemplateIds },
    });
  }
}
