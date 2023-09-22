import { Event } from '@app/modules/event-bus';
import { ConnectionSyncInterface } from '@app/interfaces/service-provider/connection-sync.interface';
import { ConnectionInterface } from '@app/interfaces/service-provider/connection.interface';

class Connection extends ConnectionInterface {
  constructor(props: ConnectionInterface) {
    super(props);
  }
}

@Event('ConnectionSync')
export class ConnectionSyncEvent extends ConnectionSyncInterface {
  public readonly connectionId: string;

  public readonly isFinished: boolean;

  public readonly connection: ConnectionInterface;

  constructor(message: ConnectionSyncEvent) {
    super(message);
    this.connectionId = message.connectionId;
    this.isFinished = message.isFinished;
    this.connection = new Connection(message.connection);
  }
}
