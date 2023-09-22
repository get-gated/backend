import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';

export class MessageChangeInterface {
  userId: string;

  connectionId: string;

  message: Omit<ConnectionEmailMessageInterface, 'messageId'>;

  externalThreadId: string;

  historyId: string;

  labelsAdded: Label[];

  labelsRemoved: Label[];

  labels: Label[];

  isNew: boolean;

  wasRemoved: boolean;

  constructor(props: MessageChangeInterface) {
    this.userId = props.userId;
    this.connectionId = props.connectionId;
    this.message = props.message;
    this.externalThreadId = props.externalThreadId;
    this.historyId = props.historyId;
    this.labelsAdded = props.labelsAdded;
    this.labelsRemoved = props.labelsRemoved;
    this.isNew = props.isNew;
    this.wasRemoved = props.wasRemoved;
    this.labels = props.labels;
  }
}
