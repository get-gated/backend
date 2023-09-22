import { Event } from '@app/modules/event-bus';
import { ConnectionInterface } from '@app/interfaces/service-provider/connection.interface';

@Event('ConnectionDeactivatedEvent')
export class ConnectionDeactivatedEvent extends ConnectionInterface {
  constructor(message: ConnectionInterface) {
    super(message);
  }
}
