import { IJob, Job } from '@app/modules/job';
import { CommandBus } from '@nestjs/cqrs';

import { ProcessPushReceiptsCommand } from './process-push-receipts.command';

@Job('ProcessPushReceipts')
export class ProcessPushReceiptsJob implements IJob {
  constructor(private readonly commandBus: CommandBus) {}

  async run(): Promise<void> {
    await this.commandBus.execute(new ProcessPushReceiptsCommand());
  }
}
