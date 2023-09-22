import { Event } from '@app/modules/event-bus';
import GatekeeperTrainingInterface from '@app/interfaces/gatekeeper/gatekeeper-training.interface';

@Event('GatekeeperTrainingAdded')
export class GatekeeperTrainingAddedEvent extends GatekeeperTrainingInterface {
  constructor(message: GatekeeperTrainingAddedEvent) {
    super(message);
  }
}
