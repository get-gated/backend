import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeUserSettingsUpdatedEvent } from '@app/events/challenge/challenge-user-settings-updated.event';

import { IdentifyCommand } from './identify.command';

@EventHandler(ChallengeUserSettingsUpdatedEvent, 'analytics-identify')
export class IdentifyChallengeUserSettingsUpdatedEventHandler
  implements IEventHandler<ChallengeUserSettingsUpdatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ChallengeUserSettingsUpdatedEvent): Promise<void> {
    await this.commandBus.execute(
      new IdentifyCommand(event.userId, {
        minimumDonation: event.minimumDonation,
        nonprofitId: event.nonprofit.nonprofitId,
        nonprofit: event.nonprofit.name,
        signature: event.signature,
      }),
    );
  }
}
