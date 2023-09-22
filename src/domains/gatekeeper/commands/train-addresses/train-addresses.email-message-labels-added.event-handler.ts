import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { CommandBus } from '@nestjs/cqrs';
import {
  Label,
  MessageType,
} from '@app/interfaces/service-provider/service-provider.enums';
import { EmailMessageLabelsAddedEvent } from '@app/events/service-provider/email-message-labels-added.event';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { TrainAddressesCommand } from './train-addresses.command';

@EventHandler(EmailMessageLabelsAddedEvent, 'service-provider-move-thread')
export default class MoveThreadMessageCreatedEventHandler
  implements IEventHandler<EmailMessageLabelsAddedEvent>
{
  constructor(
    private commandBus: CommandBus,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async handler(event: EmailMessageLabelsAddedEvent): Promise<void> {
    if (event.type === MessageType.Sent) return; // do not train if the user is the sender of the message;

    const cacheKey = `train-addresses-message-labels-added-${event.userId}_${event.from.emailAddress}`;

    if (await this.cache.get(cacheKey)) {
      throw new Error(
        'Current processing this sender for the user. Try again soon.',
      );
    }
    await this.cache.set(cacheKey, true, { ttl: 1 });

    try {
      if (event.addedLabels.includes(Label.TrainAsGated)) {
        await this.commandBus.execute(
          new TrainAddressesCommand(
            event.userId,
            [event.from.emailAddress],
            Rule.Mute,
            TrainingOrigin.UserInbox,
          ),
        );
        return;
      }

      if (event.addedLabels.includes(Label.TrainAsAllowed)) {
        await this.commandBus.execute(
          new TrainAddressesCommand(
            event.userId,
            [event.from.emailAddress],
            Rule.Allow,
            TrainingOrigin.UserInbox,
          ),
        );
        return;
      }
    } finally {
      await this.cache.del(cacheKey);
    }
  }
}
