import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';

import { ServiceProviderAppService } from '../../../service-provider';

import { MoveTxEmailToInboxCommand } from './move-tx-email-to-inbox.command';

@CommandHandler(MoveTxEmailToInboxCommand)
export class MoveTxEmailToInboxCommandHandler
  implements ICommandHandler<MoveTxEmailToInboxCommand>
{
  constructor(private serviceProvider: ServiceProviderAppService) {}

  async execute(command: MoveTxEmailToInboxCommand): Promise<void> {
    const { connectionId, threadId } = command;
    await this.serviceProvider.commandMoveThread({
      connectionId,
      destination: Label.Inbox,
      threadId,
    });
  }
}
