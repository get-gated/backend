import { Event } from '@app/modules/event-bus';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

@Event('EmailMessageCreated')
export class EmailMessageCreatedEvent extends ConnectionEmailMessageInterface {
  public readonly threadId: string;

  public readonly connectionId: string;

  public readonly isConnectionActive: boolean;

  public readonly isBounced: boolean;

  constructor(message: EmailMessageCreatedEvent) {
    super(message);
    this.threadId = message.threadId;
    this.connectionId = message.connectionId;
    this.isConnectionActive = message.isConnectionActive;
    this.isBounced = message.isBounced || false;
  }
}
