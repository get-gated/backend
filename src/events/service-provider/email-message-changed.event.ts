import { Event } from '@app/modules/event-bus';
import { MessageChangeInterface } from '@app/interfaces/service-provider/message-change.interface';

@Event('MessageChangedEvent')
export class EmailMessageChangedEvent extends MessageChangeInterface {
  constructor(message: EmailMessageChangedEvent) {
    super(message);
  }
}
