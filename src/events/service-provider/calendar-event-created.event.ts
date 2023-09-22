import { Event } from '@app/modules/event-bus';
import { CalendarEventInterface } from '@app/interfaces/service-provider/calendar-event.interface';

@Event('CalendarEventCreated')
export class CalendarEventCreatedEvent extends CalendarEventInterface {
  constructor(message: CalendarEventInterface) {
    super(message);
  }
}
