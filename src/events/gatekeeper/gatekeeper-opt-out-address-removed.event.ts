import { Event } from '@app/modules/event-bus';
import GatekeeperOptOutAddressInterface from '@app/interfaces/gatekeeper/gatekeeper-opt-out-address.interface';

@Event('GatekeeperOptOutAddressRemoved')
export class GatekeeperOptOutAddressRemovedEvent extends GatekeeperOptOutAddressInterface {
  constructor(message: GatekeeperOptOutAddressRemovedEvent) {
    super(message);
  }
}
