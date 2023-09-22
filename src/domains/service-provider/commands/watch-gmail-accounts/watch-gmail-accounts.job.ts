import { IJob, Job } from '@app/modules/job';
import { CommandBus } from '@nestjs/cqrs';

import { WatchGmailAccountsCommand } from './watch-gmail-accounts.command';

/* Should be scheduled daily */
@Job('WatchGmailAccounts')
export class WatchGmailAccountsJob implements IJob {
  constructor(private readonly commandBus: CommandBus) {}

  async run(): Promise<void> {
    return this.commandBus.execute(new WatchGmailAccountsCommand());
  }
}
