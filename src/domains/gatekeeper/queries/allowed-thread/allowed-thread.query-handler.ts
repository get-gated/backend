import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { AllowedThreadEntity } from '../../entities/allowed-thread.entity';

import { AllowedThreadQuery } from './allowed-thread.query';

@QueryHandler(AllowedThreadQuery)
export class AllowedThreadQueryHandler
  implements IQueryHandler<AllowedThreadQuery>
{
  constructor(
    @InjectRepository(AllowedThreadEntity)
    private allowedThreadRepo: EntityRepository<AllowedThreadEntity>,
  ) {}

  async execute(query: AllowedThreadQuery): Promise<AllowedThreadEntity[]> {
    return this.allowedThreadRepo.find({
      allowedThreadId: { $in: query.allowedThreadIds },
    });
  }
}
