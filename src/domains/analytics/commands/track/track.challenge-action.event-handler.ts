import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeActionEvent } from '@app/events/challenge/challenge-action.event';
import { ChallengeAction } from '@app/interfaces/challenge/challenge.enums';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(ChallengeActionEvent, 'analytics-track')
export class TrackChallengeActionEventHandler
  implements IEventHandler<ChallengeActionEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: ChallengeActionEvent): Promise<void> {
    let eventName: AnalyticEvent;
    switch (event.action) {
      case ChallengeAction.Present:
        eventName = AnalyticEvent.backend_gatekeeper_ChallengePresented;
        break;
      case ChallengeAction.Withhold:
        eventName = AnalyticEvent.ChallengeWithheld;
        break;
    }

    await this.commandBus.execute(
      new TrackCommand(eventName, event.userId, {
        connectionId: event.connectionId, // id for the conenction the challenge is on
        messageId: event.messageId, // id for the message challenge is on
        threadId: event.threadId, // id for the thread the challenge is on
        templateId: event.templateId, // id for the challenge template
        mode: event.mode, // ?? Event mode?
        withholdReason: event.withholdReason, // reason challenge was withheld
        sentMessageId: event.sentMessageId, // id for the message sent as part of the challenge
        messageSenderAddress: event.to, // address for the sender of the challenged message
        challengeId: event.challengeId, // id for the challenge
        nonprofitId: event.nonprofit.nonprofitId, // id for the nonprofit in challenge
        nonprofitName: event.nonprofit.name, // name of the nonprofit in challenge
      }),
    );
  }
}
