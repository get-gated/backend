import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import DecisionEntity from '../../entities/decision.entity';

import { DecisionByMessageQuery } from './decision-by-message.query';

@QueryHandler(DecisionByMessageQuery)
export class DecisionByMessageQueryHandler
  implements IQueryHandler<DecisionByMessageQuery>
{
  constructor(
    @InjectRepository(DecisionEntity)
    private decisionRepo: EntityRepository<DecisionEntity>,
  ) {}

  async execute(query: DecisionByMessageQuery): Promise<any> {
    return this.decisionRepo.findOne({ messageId: query.messageId });
  }
}
