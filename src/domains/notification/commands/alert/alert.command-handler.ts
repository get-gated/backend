import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TxEmailAdapter } from '../../services/tx-email/tx-email.adapter';

import { AlertCommand } from './alert.command';

@CommandHandler(AlertCommand)
export class AlertCommandHandler implements ICommandHandler<AlertCommand> {
  constructor(private email: TxEmailAdapter) {}

  async execute(command: AlertCommand): Promise<void> {
    await this.email.sendCustom({ from: 'alerts@gated.com', ...command });
  }
}
