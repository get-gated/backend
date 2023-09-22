import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeUserSettingsUpdatedEvent } from '@app/events/challenge/challenge-user-settings-updated.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ChallengeUserSettingsUpdatedEvent, 'analytics-track')
export class TrackChallengeUserSettingsUpdatedEventHandler
  implements IEventHandler<ChallengeUserSettingsUpdatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ChallengeUserSettingsUpdatedEvent): Promise<void> {
    await this.commandBus.execute(
      new TrackCommand(
        AnalyticEvent.backend_user_ChangeDonationSettings,
        event.userId,
        {
          minimumDonation: event.minimumDonation,
          nonprofitId: event.nonprofit.nonprofitId,
          nonprofit: event.nonprofit.name,
        },
      ),
    );
  }
}
