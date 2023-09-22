import { Transaction } from './notification.enums';

export abstract class TxEmailInterface {
  public readonly txEmailId: string;

  public readonly userId?: string;

  public readonly toAddress: string;

  public readonly toName: string;

  public readonly sentAt: Date;

  public readonly transaction: Transaction;

  constructor(props: TxEmailInterface) {
    this.txEmailId = props.txEmailId;
    this.userId = props.userId;
    this.toAddress = props.toAddress;
    this.toName = props.toName;
    this.sentAt = new Date(props.sentAt);
    this.transaction = props.transaction;
  }
}
