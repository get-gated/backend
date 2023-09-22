import { Event } from '@app/modules/event-bus';
import ChallengeInterface from '@app/interfaces/challenge/challenge.interface';
import ChallengeNonprofitInterface from '@app/interfaces/challenge/challenge-nonprofit.interface';

@Event('ChallengeResponseInitiated')
export class ChallengeResponseInitiatedEvent extends ChallengeInterface {
  public readonly nonprofit: ChallengeNonprofitInterface;

  public readonly hasDonation: boolean;

  public readonly hasExpected: boolean;

  constructor(message: ChallengeResponseInitiatedEvent) {
    super(message);
    this.nonprofit = message.nonprofit;
    this.hasDonation = message.hasDonation;
    this.hasExpected = message.hasExpected;
  }
}
