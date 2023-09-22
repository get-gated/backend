import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { LoggerService } from '@app/modules/logger';

import { AllowedThreadEntity } from '../../entities/allowed-thread.entity';

import { AllowThreadCommand } from './allow-thread.command';

@CommandHandler(AllowThreadCommand)
export class AllowThreadCommandHandler
  implements ICommandHandler<AllowThreadCommand>
{
  constructor(
    @InjectRepository(AllowedThreadEntity)
    private allowedThreadRepo: EntityRepository<AllowedThreadEntity>,
    private log: LoggerService,
  ) {}

  async execute(command: AllowThreadCommand): Promise<void> {
    const { threadId, reason } = command;

    const existing = await this.allowedThreadRepo.findOne({ threadId });
    if (existing) {
      this.log.info({ existing, command }, 'Thread already allowed. Skipping');
      return;
    }

    const allowedThread = new AllowedThreadEntity({
      threadId,
      reason,
    });

    await this.allowedThreadRepo.persistAndFlush(allowedThread);
  }
}
