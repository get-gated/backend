import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { UserJoinedEvent } from '@app/events/user/user-joined.event';
import { CommandBus } from '@nestjs/cqrs';

import { ReferralCodeCommand } from './referral-code.command';

@EventHandler(UserJoinedEvent, 'referral-code')
export class ReferralCodeUserJoinedEventHandler
  implements IEventHandler<UserJoinedEvent>
{
  constructor(private commandBus: CommandBus) {}

  async handler(event: UserJoinedEvent): Promise<void> {
    await this.commandBus.execute(new ReferralCodeCommand(event.userId));
  }
}
