import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeConnectionSettingsUpdatedEvent } from '@app/events/challenge/challenge-connection-settings-updated.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ChallengeConnectionSettingsUpdatedEvent, 'analytics-track')
export class TrackChallengeConnectionSettingsUpdatedEventHandler
  implements IEventHandler<ChallengeConnectionSettingsUpdatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ChallengeConnectionSettingsUpdatedEvent): Promise<void> {
    await this.commandBus.execute(
      new TrackCommand(
        AnalyticEvent.ChallengeConnectionSettingsUpdated,
        event.userId,
        {
          connectionId: event.connectionId,
          challengeConnectionSettingId: event.challengeConnectionSettingId,
          mode: event.mode,
          templateId: event.templateId,
          greetingBlock: event.greetingBlock,
          leadBlock: event.leadBlock,
          donateBlock: event.donateBlock,
          expectedBlock: event.expectedBlock,
          signatureBlock: event.signatureBlock,
        },
      ),
    );
  }
}
