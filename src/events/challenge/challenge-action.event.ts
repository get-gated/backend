import { Event } from '@app/modules/event-bus';
import { ChallengeMode } from '@app/interfaces/challenge/challenge.enums';
import ChallengeInterface from '@app/interfaces/challenge/challenge.interface';
import ChallengeNonprofitInterface from '@app/interfaces/challenge/challenge-nonprofit.interface';

@Event('ChallengeAction')
export class ChallengeActionEvent extends ChallengeInterface {
  public override readonly mode: ChallengeMode;

  public readonly templateId: string;

  public readonly nonprofit: ChallengeNonprofitInterface;

  constructor(message: ChallengeActionEvent) {
    super(message);
    this.mode = message.mode;
    this.templateId = message.templateId;
    this.nonprofit = message.nonprofit;
  }
}
