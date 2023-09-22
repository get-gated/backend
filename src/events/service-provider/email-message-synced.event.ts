import { Event } from '@app/modules/event-bus';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

@Event('EmailMessageSynced')
export class EmailMessageSyncedEvent extends ConnectionEmailMessageInterface {
  public readonly connectionId: string;

  public readonly threadId?: string;

  constructor(message: EmailMessageSyncedEvent) {
    super(message);
    this.connectionId = message.connectionId;
  }
}
