import { Transaction } from '@app/interfaces/notification/notification.enums';
import { v4 as uuidv4 } from 'uuid';

import { TxTemplateVariables } from '../../services/tx-email/tx-email.service';

export default class SendTxEmailCommand {
  constructor(
    public readonly userId: string,
    public readonly toEmailAddress: string,
    public readonly toName: string,
    public readonly transaction: Transaction,
    public readonly variables: TxTemplateVariables,
    public readonly uniqueId: string = uuidv4(),
    public readonly sendAt: Date = new Date(),
    public readonly fromName?: string,
    public readonly fromAddress?: string,
    public readonly replyToAddress?: string,
    public readonly suppressionGroupId?: number,
  ) {}
}
