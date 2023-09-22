import { Event } from '@app/modules/event-bus';
import { ConnectionInterface } from '@app/interfaces/service-provider/connection.interface';

@Event('ConnectionAddedEvent')
export class ConnectionAddedEvent extends ConnectionInterface {
  public readonly activate: boolean;

  constructor(message: ConnectionAddedEvent) {
    super(message);

    this.activate = message.activate || false;
  }
}
