import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UtilsService } from '@app/modules/utils';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { GatekeeperDecisionMadeEvent } from '@app/events/gatekeeper/gatekeeper-decision-made.event';

import { TrainAddressesCommand } from './train-addresses.command';

/**
 * @description
 * Train addresses on the CC field of an allowed message as allowed.
 */

@EventHandler(GatekeeperDecisionMadeEvent, 'gatekeeper-train-addresses-command')
@Injectable()
export default class TrainAddressesGatekeeperDecisionMadeEventHandler
  implements IEventHandler<GatekeeperDecisionMadeEvent>
{
  constructor(private commandBus: CommandBus, private utils: UtilsService) {}

  async handler(event: GatekeeperDecisionMadeEvent): Promise<any> {
    if (event.ruling !== Rule.Allow) return;
    if (event.message.calendarEvent) return; // calendar events are handled independently

    const addresses = [
      ...this.utils.getAddressesFromParticipants(event.message.cc ?? []),
      ...this.utils.getAddressesFromParticipants(event.message.to),
      event.message.from.emailAddress,
    ];

    return this.commandBus.execute(
      new TrainAddressesCommand(
        event.userId,
        addresses,
        Rule.Allow,
        TrainingOrigin.IncludedOnAllowed,
      ),
    );
  }
}
