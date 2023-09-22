import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { PushService } from '../../services/push/push.service';
import PushTokenEntity from '../../entities/push-token.entity';
import PushReceiptEntity from '../../entities/push-receipt.entity';

import { ProcessPushReceiptsCommand } from './process-push-receipts.command';

@CommandHandler(ProcessPushReceiptsCommand)
export class ProcessPushReceiptsCommandHandler
  implements ICommandHandler<ProcessPushReceiptsCommand>
{
  constructor(
    private readonly pushService: PushService,
    @InjectRepository(PushTokenEntity)
    private pushTokenRepo: EntityRepository<PushTokenEntity>,
    @InjectRepository(PushReceiptEntity)
    private pushReceiptRepo: EntityRepository<PushReceiptEntity>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_command: ProcessPushReceiptsCommand): Promise<any> {
    // expo docs recommend we check 15 minutes after sends
    const fifteenMinAgo = new Date();
    fifteenMinAgo.setMinutes(fifteenMinAgo.getMinutes() - 15);

    // expo docs discard receipts after 24 hours so theres no reason in checking ones sent before then
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const receipts = await this.pushReceiptRepo.find({
      confirmedAt: null,
      sentAt: { $lt: fifteenMinAgo, $gt: twentyFourHoursAgo },
    });

    if (receipts.length === 0) return;
    const receiptIds = receipts.map((i) => i.externalReceiptId);
    const response = await this.pushService.processReceipts(receiptIds);

    const now = new Date();

    const rejectedTokens: string[] = [];

    if (!response) {
      return;
    }

    response.forEach((processedReceipt) => {
      const receipt = receipts.find(
        (i) => i.externalReceiptId === processedReceipt.receiptId,
      );
      if (!receipt) {
        return;
      }
      receipt.confirmedAt = now;
      receipt.error = processedReceipt.error;
      this.pushReceiptRepo.persist(receipt);
      if (receipt.error === 'DeviceNotRegistered') {
        rejectedTokens.push(receipt.token.pushTokenId);
      }
    });

    if (rejectedTokens.length > 0) {
      await this.pushTokenRepo.nativeUpdate(
        { pushTokenId: { $in: rejectedTokens } },
        {
          deletedAt: now,
        },
      );
    }

    await this.pushReceiptRepo.flush();
  }
}
