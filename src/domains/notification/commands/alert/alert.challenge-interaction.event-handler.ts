import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ChallengeInteractionEvent } from '@app/events/challenge/challenge-interaction.event';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { ChallengeInteraction as Interaction } from '@app/interfaces/challenge/challenge.enums';
import {
  ChallengeInteraction,
  ChallengeInteractionDonated,
} from '@app/interfaces/challenge/challenge-interaction.interface';
import { ConfigType } from '@nestjs/config';

import NotificationConfig from '../../notification.config';
import { TxEmailService } from '../../services/tx-email/tx-email.service';

import { AlertCommand } from './alert.command';

function isDonated(
  interaction: ChallengeInteraction,
): interaction is ChallengeInteractionDonated {
  return !!(
    interaction.paymentId &&
    interaction.paymentAmount &&
    interaction.interaction === Interaction.Donated
  );
}

@EventHandler(ChallengeInteractionEvent, 'notification-alert')
@Injectable()
export default class AlertChallengeInteractionEventHandler
  implements IEventHandler<ChallengeInteractionEvent>
{
  constructor(
    private commandBus: CommandBus,
    @Inject(NotificationConfig.KEY)
    private notificationConfig: ConfigType<typeof NotificationConfig>,
    private txEmailService: TxEmailService,
  ) {}

  async handler(event: ChallengeInteractionEvent): Promise<void> {
    const { challenge, paymentId } = event;
    const { userId } = challenge;

    if (!isDonated(event)) {
      return;
    }

    const to = this.notificationConfig.alertAddress.donationMade;

    if (!to) return;

    const vars = await this.txEmailService.getVariables({ userId, paymentId });
    const amount = `$${event.paymentAmount / 100}`;

    const message = `
    <html>
    <p>${vars.userFullName} received a donation of ${amount} from by ${
      challenge.to
    } for their nonprofit ${event.challenge.nonprofit.name}.</p>
    <p>The original challenge was sent on ${challenge.createdAt?.toLocaleString(
      'en-US',
      {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      },
    )}</p>
    <strong>Gated System IDs</strong>
    <ul>
      <li>paymentId: ${paymentId}</li>
      <li>userId: ${challenge.userId}</li>
      <li>challengeId: ${challenge.challengeId}</li>
      <li>connectionId: ${challenge.connectionId}</li>
      </ul> 
    </html>
    `;

    await this.commandBus.execute(
      new AlertCommand(to, `New ${amount} Donation Received!`, message),
    );
  }
}
