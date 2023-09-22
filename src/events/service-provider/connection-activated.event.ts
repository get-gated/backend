import { Event } from '@app/modules/event-bus';
import { ConnectionInterface } from '@app/interfaces/service-provider/connection.interface';

@Event('ConnectionActivatedEvent')
export class ConnectionActivatedEvent extends ConnectionInterface {
  constructor(message: ConnectionInterface) {
    super(message);
  }
}
