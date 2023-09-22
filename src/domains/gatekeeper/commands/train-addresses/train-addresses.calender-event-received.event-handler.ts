import { CalendarEventCreatedEvent } from '@app/events/service-provider/calendar-event-created.event';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';

import { TrainAddressesCommand } from './train-addresses.command';

@EventHandler(CalendarEventCreatedEvent, 'gatekeeper-train-addresses-command')
@Injectable()
export default class TrainAddressesCalenderEventReceivedEventHandler
  implements IEventHandler<CalendarEventCreatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: CalendarEventCreatedEvent): Promise<any> {
    const participantAddresses = event.participants.map(
      (participant) => participant.emailAddress,
    );
    return this.commandBus.execute(
      new TrainAddressesCommand(
        event.userId,
        participantAddresses,
        Rule.Allow,
        TrainingOrigin.ReceivedEmail,
      ),
    );
  }
}
