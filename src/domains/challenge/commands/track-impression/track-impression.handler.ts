import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeNonprofitImpressionEntity from '../../entities/impression.entity';
import NonprofitEntity from '../../entities/nonprofit.entity';

import { TrackImpressionCommand } from './track-impression.command';

@CommandHandler(TrackImpressionCommand)
export class TrackImpressionHandler
  implements ICommandHandler<TrackImpressionCommand>
{
  constructor(
    @InjectRepository(ChallengeNonprofitImpressionEntity)
    private readonly impressionRepo: EntityRepository<ChallengeNonprofitImpressionEntity>,
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  async execute(command: TrackImpressionCommand): Promise<void> {
    const { userId, nonprofitId, source } = command;
    const impression = new ChallengeNonprofitImpressionEntity({
      nonprofit: this.nonprofitRepo.getReference(nonprofitId),
      source,
      userId,
    });

    await this.impressionRepo.persistAndFlush(impression);
  }
}
