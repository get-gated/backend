import { GaxiosResponse } from 'gaxios';
import { gmail_v1 } from 'googleapis';
import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';

import ConnectionEntity from '../../../../entities/connection.entity';

import { GoogleLabel } from './google.enums';

export type ConnectionWithHistory = ConnectionEntity & {
  lastHistoryId: string;
};

export interface EmailMessage extends ConnectionEmailMessageInterface {
  labels: Label[];
}

export interface HistoryMessage {
  messageId: string;
  threadId: string;
  historyId: string;
  labelsAdded: string[];
  labelsRemoved: string[];
  isNew: boolean;
  wasRemoved: boolean;
}

export type LabelId = GoogleLabel | string;

export type ListHistoryResponse =
  GaxiosResponse<gmail_v1.Schema$ListHistoryResponse>;

export type GmailMessageWithPayload = gmail_v1.Schema$Message & {
  payload: gmail_v1.Schema$MessagePart;
};

export type HasId<T> = T & { id: string };

export interface MessagePage {
  messages: ConnectionEmailMessageInterface[];
  nextPageToken?: string | null;
}

/** alias */
export type GmailMessage = gmail_v1.Schema$Message;
