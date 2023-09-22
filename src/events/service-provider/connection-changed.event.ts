import { Event } from '@app/modules/event-bus';
import { ConnectionInterface } from '@app/interfaces/service-provider/connection.interface';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';

@Event('ConnectionChanged')
export class ConnectionChangedEvent extends ConnectionInterface {
  public readonly previousStatus: Status;

  constructor(message: ConnectionChangedEvent) {
    super(message);

    this.previousStatus = message.previousStatus;
  }
}
