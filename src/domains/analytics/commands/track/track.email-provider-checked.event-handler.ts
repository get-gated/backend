import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { EmailProviderCheckedEvent } from '@app/events/service-provider/email-provider-checked.event';

import { AnalyticEvent } from '../../analytics.enums';

import { TrackCommand } from './track.command';

@EventHandler(EmailProviderCheckedEvent, 'analytics-track')
@Injectable()
export default class TrackEmailProviderCheckedEventHandler
  implements IEventHandler<EmailProviderCheckedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: EmailProviderCheckedEvent): Promise<void> {
    await this.commandBus.execute(
      new TrackCommand(AnalyticEvent.JoinAttempted, undefined, {
        isGoogle: event.isGoogle,
        emailAddress: event.emailAddress,
      }),
    );
  }
}
