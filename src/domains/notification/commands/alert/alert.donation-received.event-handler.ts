import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { DonationRequestReceivedEvent } from '@app/events/challenge/donation-request-received.event';
import { CommandBus } from '@nestjs/cqrs';
import { UtilsService } from '@app/modules/utils';
import { DonationRequestType } from '@app/interfaces/challenge/challenge.enums';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import NotificationConfig from '../../notification.config';
import { TxEmailService } from '../../services/tx-email/tx-email.service';

import { AlertCommand } from './alert.command';

@EventHandler(DonationRequestReceivedEvent, 'notification-alert')
export class AlertDonationReceivedEventHandler
  implements IEventHandler<DonationRequestReceivedEvent>
{
  constructor(
    private commandBus: CommandBus,
    private utils: UtilsService,
    @Inject(NotificationConfig.KEY)
    private notificationConfig: ConfigType<typeof NotificationConfig>,
    private txEmailService: TxEmailService,
  ) {}

  async handler(event: DonationRequestReceivedEvent): Promise<void> {
    const { userId } = event.request;

    const to = this.notificationConfig.alertAddress.donationRequestDonated;

    if (!to) return;

    const vars = await this.txEmailService.getVariables({ userId });
    const amount = this.utils.formatCurrency(event.amountInCents);

    const subject = `${amount} received by @${vars.userHandle}`;

    const html = `
    <html>
      <p>
       ${vars.userFullName} received a donation of ${amount} to ${
      event.request.nonprofit.name
    } for their ${
      event.request.type === DonationRequestType.SingleUse ? 'request' : 'page'
    } "${
      event.request.type === DonationRequestType.SingleUse
        ? event.request.memo
        : event.request.name
    }".
      </p>
      
      <p>
      Message from donor: <br/>
      ${event.note}
      </p>
      
      ${
        event.request.type === DonationRequestType.LongLiving
          ? `
      <ul>
       <li>Is Featured: ${event.request.isFeatured ? 'Yes' : 'No'}</li>
       <li>Button Label: ${event.request.cta} </li>
       <li>Intro: ${event.request.memo}</Li>
      </ul>
      `
          : ''
      } 
      
      <strong>Gated System IDs</strong>
      <ul>
        <li>paymentId: ${event.paymentId}</li>
        <li>userId: ${event.request.userId}</li>
        <li>donationRequestId: ${event.request.donationRequestId}</li>
        <li>donationRequestInteractionId: ${
          event.donationRequestInteractionId
        }</li>
      </ul> 
    </html>
    `;

    await this.commandBus.execute(new AlertCommand(to, subject, html));
  }
}
