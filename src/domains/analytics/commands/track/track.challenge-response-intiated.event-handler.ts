import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeResponseInitiatedEvent } from '@app/events/challenge/challenge-response-initiated.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ChallengeResponseInitiatedEvent, 'analytics-track')
export class TrackChallengeResponseIntitiatedEventHandler
  implements IEventHandler<ChallengeResponseInitiatedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ChallengeResponseInitiatedEvent): Promise<void> {
    const eventName = AnalyticEvent.backend_sender_ChallengeResponseInitiated;

    await this.commandBus.execute(
      new TrackCommand(eventName, event.userId, {
        connectionId: event.connectionId, // id for the conenction the challenge is on
        challengeId: event.challengeId, // id for the challenge
        messageId: event.messageId, // id for the message challenge is on
        threadId: event.threadId, // id for the thread the challenge is on
        mode: event.mode, // ?? Event mode?
        hasExpected: event.hasExpected, // Booleen: was the the bypass flow?
        hasDonation: event.hasDonation, // boolean: was this the donation flow?
        messageSenderAddress: event.to, // address for the sender of the challenged message
        nonprofitId: event.nonprofit.nonprofitId, // id for the nonprofit in challenge
        nonprofitName: event.nonprofit.name, // name of the nonprofit in challenge
      }),
    );
  }
}
