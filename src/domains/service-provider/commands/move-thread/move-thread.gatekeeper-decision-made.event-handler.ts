import { Injectable } from '@nestjs/common';
import { GatekeeperDecisionMadeEvent } from '@app/events/gatekeeper/gatekeeper-decision-made.event';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { CommandBus } from '@nestjs/cqrs';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';
import { EventHandler, IEventHandler } from '@app/modules/event-bus';

import { MoveThreadCommand } from './move-thread.command';

@EventHandler(GatekeeperDecisionMadeEvent, 'service-provider-move-thread')
@Injectable()
export default class MoveThreadGatekeeperDecisionMadeEventHandler
  implements IEventHandler<GatekeeperDecisionMadeEvent>
{
  constructor(private commandBus: CommandBus) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handler(event: GatekeeperDecisionMadeEvent): Promise<any | void> {
    const { connectionId, threadId, ruling } = event;

    if (ruling === Rule.Gate || ruling === Rule.Mute) {
      return this.commandBus.execute(
        new MoveThreadCommand(connectionId, threadId, Label.Gated),
      );
    }
  }
}
