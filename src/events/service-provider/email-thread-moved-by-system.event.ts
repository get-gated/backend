import { Event } from '@app/modules/event-bus';
import { MoveThreadDestination } from '@app/interfaces/service-provider/service-provider.enums';
import { ThreadInterface } from '@app/interfaces/service-provider/thread.interface';

interface ConnectionEmailThreadMovedBySystemEventInterface
  extends ThreadInterface {
  destination: MoveThreadDestination;
}

@Event('EmailThreadMovedBySystem')
export class ConnectionEmailThreadMovedBySystemEvent
  extends ThreadInterface
  implements ConnectionEmailThreadMovedBySystemEventInterface
{
  public readonly destination: MoveThreadDestination;

  public readonly connectionId: string;

  constructor(message: ConnectionEmailThreadMovedBySystemEventInterface) {
    super(message);
    this.destination = message.destination;
    this.connectionId = message.connectionId;
  }
}
