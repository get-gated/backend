import { Event } from '@app/modules/event-bus';
import { DonationRequestInteractionInterface } from '@app/interfaces/challenge/donation-request-interaction.interface';

@Event('DonationRequestReceived')
export class DonationRequestReceivedEvent extends DonationRequestInteractionInterface {
  constructor(message: DonationRequestReceivedEvent) {
    super(message);
  }
}
