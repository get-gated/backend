import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ScheduledConnectionRemovalEntity from '../../entities/scheduled-connection-removal.entity';

import { ScheduleConnectionRemovalCommand } from './schedule-connection-removal.command';

@CommandHandler(ScheduleConnectionRemovalCommand)
export class ScheduleConnectionRemovalCommandHandler
  implements ICommandHandler<ScheduleConnectionRemovalCommand>
{
  constructor(
    @InjectRepository(ScheduledConnectionRemovalEntity)
    private scheduleRepo: EntityRepository<ScheduledConnectionRemovalEntity>,
  ) {}

  async execute(command: ScheduleConnectionRemovalCommand): Promise<void> {
    const schedule = new ScheduledConnectionRemovalEntity({
      connectionId: command.connectionId,
    });
    return this.scheduleRepo.persistAndFlush(schedule);
  }
}
