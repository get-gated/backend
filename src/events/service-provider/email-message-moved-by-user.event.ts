import { Event } from '@app/modules/event-bus';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

interface ConnectionEmailMessageMovedByUserEventInterface
  extends ConnectionEmailMessageInterface {
  previousLabels: Label[];
}

@Event('EmailMessageMovedByUser')
export class ConnectionEmailMessageMovedByUserEvent
  extends ConnectionEmailMessageInterface
  implements ConnectionEmailMessageMovedByUserEventInterface
{
  public readonly previousLabels: Label[];

  public readonly connectionId: string;

  public readonly threadId: ConnectionEmailMessageMovedByUserEventInterface['threadId'];

  constructor(message: ConnectionEmailMessageMovedByUserEventInterface) {
    super(message);
    this.connectionId = message.connectionId;
    this.threadId = message.threadId;
    this.previousLabels = message.previousLabels;
  }
}
