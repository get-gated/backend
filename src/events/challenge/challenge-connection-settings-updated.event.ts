import { Event } from '@app/modules/event-bus';
import ChallengeConnectionSettingsInterface from '@app/interfaces/challenge/challenge-connection-settings.interface';

@Event('ChallengeConnectionSettingsUpdated')
export class ChallengeConnectionSettingsUpdatedEvent extends ChallengeConnectionSettingsInterface {
  public readonly templateId?: string;

  constructor(message: ChallengeConnectionSettingsInterface) {
    super(message);
    this.templateId = message.templateId;
  }
}
