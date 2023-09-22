import { ConnectionEmailMessageInterface } from '@app/interfaces/service-provider/message.interface';
import {
  Status,
  SyncType,
} from '@app/interfaces/service-provider/service-provider.enums';
import { InjectMessageInterface } from '@app/interfaces/service-provider/inject-message.interface';

import ConnectionEntity from '../../../entities/connection.entity';
import HistoryMessageEntity, {
  IHistoryMessageEntityConstructor,
} from '../../../entities/history-message.entity';
import HistoryThreadEntity, {
  IHistoryThreadEntityConstructor,
} from '../../../entities/history-thread.entity';

export interface ProviderSyncResponse {
  messages: ConnectionEmailMessageInterface[];
  nextPageToken?: string | null;
}

export type TPartialThread = Omit<
  IHistoryThreadEntityConstructor,
  'userId' | 'connection'
>;

export type TPartialMessage = Omit<
  IHistoryMessageEntityConstructor,
  'userId' | 'connection' | 'thread'
>;

export type TPartialSentMessage = Pick<
  HistoryMessageEntity,
  | 'externalMessageId'
  | 'to'
  | 'from'
  | 'connection'
  | 'userId'
  | 'wasSentBySystem'
  | 'receivedAt'
  | 'type'
  | 'isMailingList'
>;

export interface TInsertMessage
  extends Omit<
    InjectMessageInterface,
    'replyToMessageId' | 'connectionId' | 'insertInThreadWithMessageId'
  > {
  replyToMessageExternalId?: string;
  insertInThreadWithMessageExternalId?: string;
}

export interface ProviderAdapterInterface {
  recentSentMessages(
    connection: ConnectionEntity,
    pageToken?: string,
    excludeToSelf?: boolean,
    excludeDomain?: string,
  ): Promise<ProviderSyncResponse>;

  recentUnrepliedMessages(
    connection: ConnectionEntity,
    pageToken?: string,
  ): Promise<ProviderSyncResponse>;

  hasSentMessageTo(
    connection: ConnectionEntity,
    emails: string[],
  ): Promise<boolean[]>;

  syncMessages(
    connection: ConnectionEntity,
    type: SyncType,
    pageToken?: string | null,
  ): Promise<ProviderSyncResponse>;

  connect(connection: ConnectionEntity): Promise<void>;

  disconnect(
    connection: ConnectionEntity,
    destroyTokens?: boolean,
  ): Promise<void>;

  sendReply(
    connection: ConnectionEntity,
    externalMessageId: string,
    body: string,
    to: string,
  ): Promise<TPartialSentMessage>;

  checkGatedLabels(connection: ConnectionEntity): Promise<void>;

  moveThreadToGated(
    connection: ConnectionEntity,
    thread: HistoryThreadEntity,
  ): Promise<void>;

  moveThreadToDonated(
    connection: ConnectionEntity,
    thread: HistoryThreadEntity,
  ): Promise<void>;

  moveThreadToInbox(
    connection: ConnectionEntity,
    thread: HistoryThreadEntity,
  ): Promise<void>;

  getConnectionStatus(connection: ConnectionEntity): Promise<Status>;

  receivedMessageCount(
    connection: ConnectionEntity,
    startDate: Date,
    endDate: Date,
  ): Promise<number>;

  isProviderTokenValid(connection: ConnectionEntity): Promise<boolean>;

  isBounced(message: TPartialMessage): boolean;

  insertLabelInstructions(connection: ConnectionEntity): Promise<void>;

  insertMessage(
    connection: ConnectionEntity,
    message: TInsertMessage,
  ): Promise<TPartialMessage>;

  addSignature(connection: ConnectionEntity, signature: string): Promise<void>;
}
