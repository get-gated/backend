import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { DonationRequestReceivedEvent } from '@app/events/challenge/donation-request-received.event';
import { CommandBus } from '@nestjs/cqrs';
import { UtilsService } from '@app/modules/utils';
import { DonationRequestType } from '@app/interfaces/challenge/challenge.enums';
import { truncate } from 'lodash';

import { SendPushCommand } from './send-push.command';

@EventHandler(DonationRequestReceivedEvent, 'send-push')
export class SendPushDonationReceivedEventHandler
  implements IEventHandler<DonationRequestReceivedEvent>
{
  constructor(private commandBus: CommandBus, private utils: UtilsService) {}

  async handler(event: DonationRequestReceivedEvent): Promise<void> {
    let body = '';

    switch (event.request.type) {
      case DonationRequestType.SingleUse:
        body = `${this.utils.formatCurrency(
          event.amountInCents,
        )} donation request received. ${truncate(event.request.memo, {
          length: 25,
        })}`;
        break;
      case DonationRequestType.LongLiving:
        body = `New ${this.utils.formatCurrency(
          event.amountInCents,
        )} donation on your page: ${truncate(event.request.name, {
          length: 25,
        })}`;
        break;
      default:
        return;
    }

    await this.commandBus.execute(
      new SendPushCommand(event.request.userId, body),
    );
  }
}
