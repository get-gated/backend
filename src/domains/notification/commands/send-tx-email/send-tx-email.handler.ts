import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { LoggerService } from '@app/modules/logger';

import { TxEmailAdapter } from '../../services/tx-email/tx-email.adapter';
import TxEmailEntity from '../../entities/tx-email.entity';
import UserSettingsEntity from '../../entities/user-settings.entity';

import SendTxEmailCommand from './send-tx-email.command';

// these emails should only be sent once
const onlyOnceTransactions = [
  Transaction.FirstExpected,
  Transaction.FirstDonationReceived,
  Transaction.FirstConnectionReady,
  Transaction.PendingFirstConnection,
];

@CommandHandler(SendTxEmailCommand)
export class SendTxEmailHandler implements ICommandHandler<SendTxEmailCommand> {
  constructor(
    private txEmailAdapter: TxEmailAdapter,
    @InjectRepository(TxEmailEntity)
    private emailRepo: EntityRepository<TxEmailEntity>,
    @InjectRepository(UserSettingsEntity)
    private userSettingRepo: EntityRepository<UserSettingsEntity>,
    private log: LoggerService,
  ) {}

  private async shouldSkip(
    userId: string,
    transaction: Transaction,
    uniqueId: string,
  ): Promise<boolean> {
    if (!this.txEmailAdapter.hasTemplate(transaction)) {
      this.log.warn('Skipping send. No template for transaction type.');
      return true;
    }

    const settings = await this.userSettingRepo.findOne({ userId });
    if (
      settings?.isDeleted &&
      transaction !== Transaction.PendingFirstConnection
    ) {
      return true;
    }

    // user has this tx email disabled
    if (settings?.disableTxEmail?.includes(transaction)) {
      return true;
    }

    if (onlyOnceTransactions.includes(transaction)) {
      const existing = await this.emailRepo.findOne({ transaction, userId });
      return Boolean(existing);
    }

    if (uniqueId) {
      const existing = await this.emailRepo.findOne({
        transaction,
        userId,
        uniqueId,
      });
      return Boolean(existing);
    }
    return false;
  }

  async execute(command: SendTxEmailCommand): Promise<void> {
    const {
      userId,
      variables,
      toEmailAddress,
      toName,
      transaction,
      sendAt,
      uniqueId,
    } = command;

    if (await this.shouldSkip(userId, transaction, uniqueId)) return;

    const newEmail = new TxEmailEntity({
      toAddress: toEmailAddress,
      toName,
      transaction,
      userId,
      sentAt: sendAt,
      variables,
      uniqueId,
    });

    try {
      await this.txEmailAdapter.send(
        newEmail,
        command.fromName,
        command.fromAddress,
        command.replyToAddress,
        command.suppressionGroupId,
      );
      await this.emailRepo.persistAndFlush(newEmail);
    } catch (error) {
      this.log.error(
        { error, email: newEmail },
        'Error sending transactional email',
      );
      throw error;
    }
  }
}
