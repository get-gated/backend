import { EventHandler, IEventHandler } from '@app/modules/event-bus';
import { GatekeeperDecisionMadeEvent } from '@app/events/gatekeeper/gatekeeper-decision-made.event';
import { CommandBus } from '@nestjs/cqrs';

import { InjectDecisionMessageCommand } from './inject-decision-message.command';

@EventHandler(GatekeeperDecisionMadeEvent, 'inject-decision-message')
export class InjectDecisionMessageGatekeeperDecisionMadeEventHandler
  implements IEventHandler<GatekeeperDecisionMadeEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  async handler(event: GatekeeperDecisionMadeEvent): Promise<void> {
    await this.commandBus.execute(
      new InjectDecisionMessageCommand(event.message, event),
    );
  }
}
