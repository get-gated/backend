import { Event } from '@app/modules/event-bus';
import ChallengeUserSettingsInterface from '@app/interfaces/challenge/challenge-user-settings.interface';
import ChallengeNonprofitInterface from '@app/interfaces/challenge/challenge-nonprofit.interface';

@Event('ChallengeUserSettingUpdated')
export class ChallengeUserSettingsUpdatedEvent extends ChallengeUserSettingsInterface {
  public readonly nonprofit: ChallengeNonprofitInterface;

  constructor(message: ChallengeUserSettingsInterface) {
    super(message);
    this.nonprofit = message.nonprofit;
  }
}
