import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryOrder } from '@mikro-orm/core';

import TrainingRepository from '../../entities/repositories/training.repository';
import TrainingEntity from '../../entities/training.entity';

import { AllowListQuery } from './allow-list.query';

@QueryHandler(AllowListQuery)
export class AllowListQueryHandler implements IQueryHandler<AllowListQuery> {
  constructor(private trainingRepo: TrainingRepository) {}

  async execute(query: AllowListQuery): Promise<TrainingEntity[]> {
    return this.trainingRepo.find(
      { userId: query.userId },
      {
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }
}
