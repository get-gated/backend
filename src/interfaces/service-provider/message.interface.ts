import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';
import { ParticipantInterface } from '@app/interfaces/service-provider/participant.interface';
import { ConnectionCalendarEventInterface } from '@app/interfaces/service-provider/event.interface';

// messageId and threadId are optional to support the initial syncing of messages that aren't persisted

export abstract class ConnectionEmailMessageInterface {
  public readonly messageId?: string;

  abstract threadId?: string;

  public readonly userId: string;

  abstract connectionId: string;

  public readonly from: ParticipantInterface;

  public readonly to: ParticipantInterface[];

  public readonly cc?: ParticipantInterface[];

  public readonly bcc?: ParticipantInterface[];

  public readonly replyTo?: ParticipantInterface[];

  public readonly receivedAt: Date;

  public readonly type: MessageType;

  public readonly wasSentBySystem?: boolean = false;

  public readonly isMailingList: boolean = false;

  public readonly externalMessageId: string;

  public readonly calendarEvent?: ConnectionCalendarEventInterface;

  public readonly isDraft?: boolean;

  public readonly isAutomated?: boolean;

  constructor(props: ConnectionEmailMessageInterface) {
    this.userId = props.userId;
    this.from = props.from;
    this.to = props.to;
    this.cc = props.cc || [];
    this.bcc = props.bcc || [];
    this.replyTo = props.replyTo || [];
    this.receivedAt = new Date(props.receivedAt);
    this.type = props.type;
    this.messageId = props.messageId;
    this.wasSentBySystem = props.wasSentBySystem || false;
    this.isMailingList = props.isMailingList;
    this.externalMessageId = props.externalMessageId;
    if (props.calendarEvent) {
      this.calendarEvent = new ConnectionCalendarEventInterface(
        props.calendarEvent,
      );
    }
    this.isDraft = !!props.isDraft;
    this.isAutomated = !!props.isAutomated;
  }
}
