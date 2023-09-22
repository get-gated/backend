import { Label } from '@app/interfaces/service-provider/service-provider.enums';

export class InjectMessageInterface {
  public readonly connectionId: string;

  public readonly body: string;

  public readonly labels?: Label[];

  public readonly isStarred?: boolean;

  public readonly isUnread?: boolean;

  public readonly fromEmail: string;

  public readonly fromName?: string;

  public readonly subject?: string; // not required if a replyToMessageId is provided

  public readonly replyToMessageId?: string;

  public readonly insertInThreadWithMessageId?: string;

  public readonly internalDate?: Date;

  constructor(props: InjectMessageInterface) {
    this.connectionId = props.connectionId;
    this.body = props.body;
    this.labels = props.labels;
    this.isStarred = props.isStarred;
    this.isUnread = props.isUnread;
    this.fromEmail = props.fromEmail;
    this.fromName = props.fromEmail;
    this.subject = props.subject;
    this.replyToMessageId = props.replyToMessageId;
    this.internalDate = this.internalDate
      ? new Date(this.internalDate)
      : undefined;
  }
}
