import { Event } from '@app/modules/event-bus';
import GatekeeperOptOutAddressInterface from '@app/interfaces/gatekeeper/gatekeeper-opt-out-address.interface';

@Event('GatekeeperOptOutAddressAdded')
export class GatekeeperOptOutAddressAddedEvent extends GatekeeperOptOutAddressInterface {
  constructor(message: GatekeeperOptOutAddressAddedEvent) {
    super(message);
  }
}
