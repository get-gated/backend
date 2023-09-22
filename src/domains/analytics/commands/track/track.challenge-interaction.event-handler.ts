import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';
import { ChallengeInteractionEvent } from '@app/events/challenge/challenge-interaction.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ChallengeInteractionEvent, 'analytics-track')
export class TrackChallengeInteractionEventHandler
  implements IEventHandler<ChallengeInteractionEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ChallengeInteractionEvent): Promise<void> {
    let eventName: AnalyticEvent;

    switch (event.interaction) {
      case ChallengeInteraction.Donated:
        eventName = AnalyticEvent.backend_sender_DonationCompleted;
        break;
      case ChallengeInteraction.UserReplied:
        eventName = AnalyticEvent.backend_user_ChallengeReply;
        break;
      case ChallengeInteraction.Clicked:
        eventName = AnalyticEvent.ChallengeLinkClicked;
        break;
      case ChallengeInteraction.Expected:
        eventName = AnalyticEvent.backend_sender_BypassCompleted;
        break;
      case ChallengeInteraction.Opened:
        eventName = AnalyticEvent.ChallengeOpened;
        break;
      default:
        return;
    }

    await this.commandBus.execute(
      new TrackCommand(eventName, event.challenge.userId, {
        challengeInteractionId: event.challengeInteractionId,
        challengeId: event.challenge.challengeId,
        paymentId: event.paymentId,
        donationAmount: event.paymentAmount,
        userReplyMessageId: event.userReplyMessageId,
        nonprofitId: event.challenge.nonprofit.nonprofitId,
        nonprofitName: event.challenge.nonprofit.name,
        threadId: event.challenge.threadId,
        fromAddress: event.challenge.to,
        userRepliedToInteraction: event.userRepliedToInteraction,
      }),
    );
  }
}
