import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { EmailMessageCreatedEvent } from '@app/events/service-provider/email-message-created.event';
import { CommandBus } from '@nestjs/cqrs';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { QueryOrder } from '@mikro-orm/core';

import MoveThreadLogEntity from '../../entities/move-thread-log.entity';
import HistoryThreadRepository from '../../entities/repositories/history-thread.repository';

import { MoveThreadCommand } from './move-thread.command';

@EventHandler(EmailMessageCreatedEvent, 'service-provider-move-thread')
export default class MoveThreadMessageCreatedEventHandler
  implements IEventHandler<EmailMessageCreatedEvent>
{
  constructor(
    private commandBus: CommandBus,
    @InjectRepository(MoveThreadLogEntity)
    private moveThreadLogRepo: EntityRepository<MoveThreadLogEntity>,
    private readonly threadRepo: HistoryThreadRepository,
  ) {}

  async handler(event: EmailMessageCreatedEvent): Promise<void> {
    if (!event.isBounced) return;

    const prevMove = await this.moveThreadLogRepo.findOne(
      {
        thread: this.threadRepo.getReference(event.threadId),
      },
      { orderBy: { createdAt: QueryOrder.DESC } },
    );
    if (prevMove?.destination === Label.Gated) {
      await this.commandBus.execute(
        new MoveThreadCommand(event.connectionId, event.threadId, Label.Gated),
      );
    }
  }
}
