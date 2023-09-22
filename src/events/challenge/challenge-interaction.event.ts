import { Event } from '@app/modules/event-bus';
import { ChallengeInteractionInterface } from '@app/interfaces/challenge/challenge-interaction.interface';

import { ChallengeActionEvent } from './challenge-action.event';

@Event('ChallengeInteraction')
export class ChallengeInteractionEvent extends ChallengeInteractionInterface {
  public readonly challenge: ChallengeActionEvent;

  constructor(message: ChallengeInteractionEvent) {
    super(message);
    this.challenge = new ChallengeActionEvent(message.challenge);
  }
}
