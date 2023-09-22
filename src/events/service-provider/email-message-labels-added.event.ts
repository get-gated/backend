import { Event } from '@app/modules/event-bus';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

interface EmailMessageLabelsAddedEventInterface
  extends ConnectionEmailMessageInterface {
  addedLabels: Label[];
}

@Event('EmailMessageLabelsAdded')
export class EmailMessageLabelsAddedEvent
  extends ConnectionEmailMessageInterface
  implements EmailMessageLabelsAddedEventInterface
{
  public readonly addedLabels: Label[];

  public readonly connectionId: string;

  public readonly threadId: EmailMessageLabelsAddedEventInterface['threadId'];

  constructor(message: EmailMessageLabelsAddedEventInterface) {
    super(message);
    this.connectionId = message.connectionId;
    this.threadId = message.threadId;
    this.addedLabels = message.addedLabels;
  }
}
