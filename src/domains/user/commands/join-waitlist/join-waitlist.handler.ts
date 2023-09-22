import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventBusService } from '@app/modules/event-bus';
import { JoinedWaitlistEvent } from '@app/events/user/joined-waitlist.event';

import { JoinWaitlistCommand } from './join-waitlist.command';

@CommandHandler(JoinWaitlistCommand)
export class JoinWaitlistHandler
  implements ICommandHandler<JoinWaitlistCommand>
{
  constructor(private eventBus: EventBusService) {}

  async execute(command: JoinWaitlistCommand): Promise<any> {
    await this.eventBus.publish(
      new JoinedWaitlistEvent({
        emailAddress: command.emailAddress,
      }),
    );
  }
}
