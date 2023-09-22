import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ConnectionLogEntity from '../../entities/connection-log.entity';
import ConnectionEntity from '../../entities/connection.entity';

import { LogConnectionChangeCommand } from './log-connection-change.command';

@CommandHandler(LogConnectionChangeCommand)
export class LogConnectionChangeCommandHandler
  implements ICommandHandler<LogConnectionChangeCommand>
{
  constructor(
    @InjectRepository(ConnectionLogEntity)
    private connectionLogRepo: EntityRepository<ConnectionLogEntity>,
    @InjectRepository(ConnectionEntity)
    private connectionRepo: EntityRepository<ConnectionEntity>,
  ) {}

  async execute(command: LogConnectionChangeCommand): Promise<void> {
    const log = new ConnectionLogEntity({
      connection: this.connectionRepo.getReference(command.connectionId),
      status: command.status,
      isActivated: command.isActivated,
    });
    return this.connectionLogRepo.persistAndFlush(log);
  }
}
