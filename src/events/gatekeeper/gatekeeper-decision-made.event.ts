import { Event } from '@app/modules/event-bus';
import GatekeeperDecisionInterface from '@app/interfaces/gatekeeper/gatekeeper-decision.interface';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';

@Event('GatekeeperDecisionMade')
export class GatekeeperDecisionMadeEvent extends GatekeeperDecisionInterface {
  public readonly message: ConnectionEmailMessageInterface;
  constructor(message: GatekeeperDecisionMadeEvent) {
    super(message);
    this.message = message.message;
  }
}
