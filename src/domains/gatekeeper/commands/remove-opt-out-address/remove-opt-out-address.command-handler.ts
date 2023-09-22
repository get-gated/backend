import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EventBusService } from '@app/modules/event-bus';
import { GatekeeperOptOutAddressRemovedEvent } from '@app/events/gatekeeper/gatekeeper-opt-out-address-removed.event';

import OptOutAddressEntity from '../../entities/opt-out-address.entity';

import { RemoveOptOutAddressCommand } from './remove-opt-out-address.command';

@CommandHandler(RemoveOptOutAddressCommand)
export class RemoveOptOutAddressCommandHandler
  implements ICommandHandler<RemoveOptOutAddressCommand>
{
  constructor(
    @InjectRepository(OptOutAddressEntity)
    private optOutRepo: EntityRepository<OptOutAddressEntity>,
    private eventBus: EventBusService,
  ) {}

  async execute(command: RemoveOptOutAddressCommand): Promise<void> {
    const { userId, optOutId } = command;
    const optOut = await this.optOutRepo.findOneOrFail({ optOutId, userId });
    optOut.deletedAt = new Date();
    await this.optOutRepo.persistAndFlush(optOut);
    await this.eventBus.publish(
      new GatekeeperOptOutAddressRemovedEvent(optOut),
    );
  }
}
