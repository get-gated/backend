import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeEntity from '../../entities/challenge.entity';

import { ChallengeByMessageIdQuery } from './challenge-by-message-id.query';

@QueryHandler(ChallengeByMessageIdQuery)
export class ChallengeByMessageIdHandler
  implements IQueryHandler<ChallengeByMessageIdQuery>
{
  constructor(
    @InjectRepository(ChallengeEntity)
    private challengeRepo: EntityRepository<ChallengeEntity>,
  ) {}

  async execute(
    query: ChallengeByMessageIdQuery,
  ): Promise<ChallengeEntity | null> {
    return this.challengeRepo.findOne({ messageId: query.messageId });
  }
}
