import { InjectMessageInterface } from '@app/interfaces/service-provider/inject-message.interface';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

export class InjectChallengeResponseCommand {
  constructor(
    public readonly message: InjectMessageInterface,
    public readonly userId: string,
    public readonly respondingTo:
      | ChallengeInteraction.Donated
      | ChallengeInteraction.Expected,
  ) {}
}
