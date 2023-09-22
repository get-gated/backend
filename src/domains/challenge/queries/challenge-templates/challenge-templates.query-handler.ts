import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeTemplateEntity from '../../entities/template.entity';

import { ChallengeTemplatesQuery } from './challenge-templates.query';

@QueryHandler(ChallengeTemplatesQuery)
export class ChallengeTemplatesQueryHandler
  implements IQueryHandler<ChallengeTemplatesQuery>
{
  constructor(
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
  ) {}

  async execute(): Promise<ChallengeTemplateEntity[]> {
    return this.templateRepo.findAll();
  }
}
