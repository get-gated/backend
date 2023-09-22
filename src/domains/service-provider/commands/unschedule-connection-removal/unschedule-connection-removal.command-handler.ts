import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ScheduledConnectionRemovalEntity from '../../entities/scheduled-connection-removal.entity';

import { UnscheduleConnectionRemovalCommand } from './unschedule-connection-removal.command';

@CommandHandler(UnscheduleConnectionRemovalCommand)
export class UnscheduleConnectionRemovalCommandHandler
  implements ICommandHandler<UnscheduleConnectionRemovalCommand>
{
  constructor(
    @InjectRepository(ScheduledConnectionRemovalEntity)
    private scheduleRepo: EntityRepository<ScheduledConnectionRemovalEntity>,
  ) {}

  async execute(command: UnscheduleConnectionRemovalCommand): Promise<number> {
    return this.scheduleRepo.nativeDelete({
      connectionId: command.connectionId,
      completedAt: null,
    });
  }
}
