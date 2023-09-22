import { Event } from '@app/modules/event-bus';
import { ConnectionInterface } from '@app/interfaces/service-provider/connection.interface';
import { ConnectionRemovedTrigger } from '@app/interfaces/service-provider/service-provider.enums';

@Event('ConnectionRemovedEvent')
export class ConnectionRemovedEvent extends ConnectionInterface {
  public readonly trigger: ConnectionRemovedTrigger;

  public readonly reasonText: string;

  public readonly experienceText: string;

  constructor(message: ConnectionRemovedEvent) {
    super(message);

    this.trigger = message.trigger;
    this.reasonText = message.reasonText || '';
    this.experienceText = message.experienceText || '';
  }
}
