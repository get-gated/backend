import { Event } from '@app/modules/event-bus';
import { DonationRequestInterface } from '@app/interfaces/challenge/donation-request.interface';

@Event('DonationRequested')
export class DonationRequestedEvent extends DonationRequestInterface {
  constructor(message: DonationRequestedEvent) {
    super(message);
  }
}
