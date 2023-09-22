import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UtilsService } from '@app/modules/utils';
import { EventBusService } from '@app/modules/event-bus';
import { GatekeeperOptOutAddressAddedEvent } from '@app/events/gatekeeper/gatekeeper-opt-out-address-added.event';

import OptOutAddressEntity from '../../entities/opt-out-address.entity';

import { AddOptOutAddressCommand } from './add-opt-out-address.command';

@CommandHandler(AddOptOutAddressCommand)
export class AddOptOutAddressCommandHandler
  implements ICommandHandler<AddOptOutAddressCommand>
{
  constructor(
    @InjectRepository(OptOutAddressEntity)
    private optOutRepo: EntityRepository<OptOutAddressEntity>,
    private utils: UtilsService,
    private eventBus: EventBusService,
  ) {}

  async execute(command: AddOptOutAddressCommand): Promise<string> {
    const optOut = new OptOutAddressEntity({
      userId: command.userId,
      emailAddress: command.emailAddress,
      normalizedEmailAddress: this.utils.normalizeEmail(command.emailAddress)
        .email,
    });
    await this.optOutRepo.persistAndFlush(optOut);
    await this.eventBus.publish(new GatekeeperOptOutAddressAddedEvent(optOut));
    return optOut.optOutId;
  }
}
