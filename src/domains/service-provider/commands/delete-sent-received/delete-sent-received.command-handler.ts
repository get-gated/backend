import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { FilterQuery } from '@mikro-orm/core';

import { SentReceivedEntity } from '../../entities/sent-received.entity';

import { DeleteSentReceivedCommand } from './delete-sent-received.command';

@CommandHandler(DeleteSentReceivedCommand)
export class DeleteSentReceivedCommandHandler
  implements ICommandHandler<DeleteSentReceivedCommand>
{
  constructor(
    @InjectRepository(SentReceivedEntity)
    private sentReceivedRepo: EntityRepository<SentReceivedEntity>,
  ) {}

  async execute(command: DeleteSentReceivedCommand): Promise<void> {
    const where: FilterQuery<SentReceivedEntity> = { userId: command.userId };

    if (command.connectionId) {
      where.connectionId = command.connectionId;
    }
    await this.sentReceivedRepo.nativeDelete(where);
  }
}
