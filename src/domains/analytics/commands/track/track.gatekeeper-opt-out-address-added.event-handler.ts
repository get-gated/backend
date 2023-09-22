import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { GatekeeperOptOutAddressAddedEvent } from '@app/events/gatekeeper/gatekeeper-opt-out-address-added.event';

import { TTrackProperties } from '../../services/adapters/adapter.interface';
import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(GatekeeperOptOutAddressAddedEvent, 'analytics-track')
export class TrackGatekeeperOptOutAddressAddedEventHandler
  implements IEventHandler<GatekeeperOptOutAddressAddedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: GatekeeperOptOutAddressAddedEvent): Promise<void> {
    const properties: TTrackProperties = {
      emailAddress: event.emailAddress,
      optOutId: event.optOutId,
    };

    await this.commandBus.execute(
      new TrackCommand(
        AnalyticEvent.OptOutAddressAdded,
        event.userId,
        properties,
      ),
    );
  }
}
