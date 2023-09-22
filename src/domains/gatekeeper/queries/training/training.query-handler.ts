import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import TrainingRepository from '../../entities/repositories/training.repository';
import TrainingEntity from '../../entities/training.entity';

import { TrainingQuery } from './training.query';

@QueryHandler(TrainingQuery)
export class TrainingQueryHandler implements IQueryHandler<TrainingQuery> {
  constructor(private trainingRepo: TrainingRepository) {}

  async execute(query: TrainingQuery): Promise<TrainingEntity[]> {
    return this.trainingRepo.find(query.trainingIds);
  }
}
