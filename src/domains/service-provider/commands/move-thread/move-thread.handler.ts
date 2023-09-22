import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';
import { EventBusService } from '@app/modules/event-bus';
import { ConnectionEmailThreadMovedBySystemEvent } from '@app/events/service-provider/email-thread-moved-by-system.event';
import { SpanEvent, TelemetryService } from '@app/modules/telemetry';

import { ProviderService } from '../../services/provider/provider.service';
import HistoryThreadRepository from '../../entities/repositories/history-thread.repository';
import MoveThreadLogEntity from '../../entities/move-thread-log.entity';
import ConnectionRepository from '../../entities/repositories/connection.repository';

import { MoveThreadCommand } from './move-thread.command';

@CommandHandler(MoveThreadCommand)
export class MoveThreadHandler implements ICommandHandler<MoveThreadCommand> {
  constructor(
    private connectionRepository: ConnectionRepository,
    private providerService: ProviderService,
    @InjectRepository(MoveThreadLogEntity)
    private moveThreadLogRepo: EntityRepository<MoveThreadLogEntity>,
    private historyThreadRepo: HistoryThreadRepository,
    private em: EntityManager,
    private eventBus: EventBusService,
    private telemetry: TelemetryService,
  ) {}

  async execute(command: MoveThreadCommand): Promise<void> {
    const { destination, connectionId, threadId } = command;
    const connection = await this.connectionRepository.findOneOrFail({
      connectionId,
    });

    const serviceProvider = this.providerService.adapters[connection.provider];

    await serviceProvider.checkGatedLabels(connection);
    this.connectionRepository.persist(connection); // labels may have been updated

    const thread = await this.historyThreadRepo.findOneOrFail({ threadId });

    // create a log of the movement
    const newMoveThreadLog = new MoveThreadLogEntity({
      destination,
      thread,
      connection,
    });

    await this.moveThreadLogRepo.persistAndFlush(newMoveThreadLog);

    try {
      switch (destination) {
        case Label.Gated:
          await serviceProvider.moveThreadToGated(connection, thread);
          break;
        case Label.Donation:
          await serviceProvider.moveThreadToDonated(connection, thread);
          break;
        case Label.Inbox:
          await serviceProvider.moveThreadToInbox(connection, thread);
          break;
      }
    } catch (error) {
      await this.moveThreadLogRepo.nativeDelete(newMoveThreadLog);
      throw error;
    }

    this.telemetry.addSpanEvent(SpanEvent.MessageMoved, { destination });

    await this.em.flush();
    await this.eventBus.publish(
      new ConnectionEmailThreadMovedBySystemEvent({
        ...thread,
        destination,
        connectionId,
      }),
    );
  }
}
