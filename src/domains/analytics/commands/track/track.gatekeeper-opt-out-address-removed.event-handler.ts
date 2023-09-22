import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { GatekeeperOptOutAddressRemovedEvent } from '@app/events/gatekeeper/gatekeeper-opt-out-address-removed.event';

import { TTrackProperties } from '../../services/adapters/adapter.interface';
import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(GatekeeperOptOutAddressRemovedEvent, 'analytics-track')
export class TrackGatekeeperOptOutAddressRemovedEventHandler
  implements IEventHandler<GatekeeperOptOutAddressRemovedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: GatekeeperOptOutAddressRemovedEvent): Promise<void> {
    const properties: TTrackProperties = {
      emailAddress: event.emailAddress,
      optOutId: event.optOutId,
    };

    await this.commandBus.execute(
      new TrackCommand(
        AnalyticEvent.OptOutAddressRemoved,
        event.userId,
        properties,
      ),
    );
  }
}
