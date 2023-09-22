import { CommandBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SyncType } from '@app/interfaces/service-provider/service-provider.enums';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ConnectionAddedEvent } from '@app/events/service-provider/connection-added.event';
import { LoggerService } from '@app/modules/logger';

import ServiceProviderConfig from '../../service-provider.config';

import { ScheduleSyncCommand } from './schedule-sync.command';

@EventHandler(ConnectionAddedEvent, 'service-provider-schedule-sync')
export class ScheduleSyncConnectionAddedEventHandler
  implements IEventHandler<ConnectionAddedEvent>
{
  constructor(
    private commandBus: CommandBus,
    @Inject(ServiceProviderConfig.KEY)
    private config: ConfigType<typeof ServiceProviderConfig>,
    private log: LoggerService,
  ) {}

  async handler(event: ConnectionAddedEvent): Promise<void> {
    const now = new Date();
    const targetDepth = new Date(
      now.setMonth(now.getMonth() - this.config.initialSyncDepthInMonths),
    );
    const { connectionId } = event;

    this.log.info(
      { connectionId, targetDepth },
      'Scheduling syncs for added connection.',
    );
    await this.commandBus.execute(
      new ScheduleSyncCommand(connectionId, SyncType.Sent, targetDepth),
    );

    await this.commandBus.execute(
      new ScheduleSyncCommand(connectionId, SyncType.Received, targetDepth),
    );
  }
}
