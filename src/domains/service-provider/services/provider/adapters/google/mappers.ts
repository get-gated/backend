import { gmail_v1 } from 'googleapis';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';
import { MessageChangeInterface } from '@app/interfaces/service-provider/message-change.interface';

import ConnectionEntity from '../../../../entities/connection.entity';

import { GoogleLabel } from './google.enums';
import { EmailMessage, HistoryMessage } from './types';

export function mapGoogleLabelsToLabels(
  // eslint-disable-next-line default-param-last
  googleLabels: (GoogleLabel | string)[] = [],
  connection: ConnectionEntity,
): Label[] {
  const mappedLabels: Label[] = [];

  const map = {
    [GoogleLabel.Inbox]: Label.Inbox,
    [GoogleLabel.Spam]: Label.Spam,
    [GoogleLabel.Trash]: Label.Trash,
    [GoogleLabel.Important]: Label.Important,
    [GoogleLabel.Sent]: Label.Sent,
    [GoogleLabel.Draft]: Label.Drafts,
    [connection.gatedLabelId]: Label.Gated,
    [connection.donatedLabelId]: Label.Donation,
    [connection.expectedLabelId]: Label.Expected,
  };
  if (connection.trainAsAllowedLabelId) {
    map[connection.trainAsAllowedLabelId] = Label.TrainAsAllowed;
  }
  if (connection.trainAsGatedLabelId) {
    map[connection.trainAsGatedLabelId] = Label.TrainAsGated;
  }

  for (let i = googleLabels.length - 1; i >= 0; i--) {
    const mappedLabel = map[googleLabels[i]];
    if (mappedLabel) mappedLabels.push(mappedLabel);
  }

  return mappedLabels;
}

export function mapToMessageChange(
  connection: ConnectionEntity,
  message: EmailMessage,
  historyMessage: HistoryMessage,
): MessageChangeInterface {
  const {
    isNew,
    wasRemoved,
    threadId: externalThreadId,
    historyId,
  } = historyMessage;

  const { userId, connectionId } = connection;

  return {
    message,
    labels: message.labels,
    isNew,
    wasRemoved,
    externalThreadId,
    historyId,
    userId,
    connectionId,
    labelsAdded: mapGoogleLabelsToLabels(
      historyMessage.labelsAdded,
      connection,
    ),
    labelsRemoved: mapGoogleLabelsToLabels(
      historyMessage.labelsRemoved,
      connection,
    ),
  };
}

export function mapGmailHistoryToHistoryMessage(
  history: gmail_v1.Schema$History[],
): HistoryMessage[] {
  let messages: HistoryMessage[] = [];

  history.forEach((historyItem) => {
    const newMessages: HistoryMessage[] = [];

    historyItem.messagesAdded?.forEach((item) => {
      const existing = newMessages.find(
        (message) => message.messageId === item.message?.id,
      );
      if (existing) {
        existing.isNew = true;
        return;
      }
      if (item.message?.id && item.message?.threadId && historyItem.id) {
        newMessages.push({
          messageId: item.message.id,
          threadId: item.message.threadId,
          labelsAdded: [],
          labelsRemoved: [],
          isNew: true,
          wasRemoved: false,
          historyId: historyItem.id,
        });
      }
    });

    historyItem.labelsAdded?.forEach((item) => {
      const existing = newMessages.find(
        (message) => message.messageId === item.message?.id,
      );
      if (existing) {
        existing.labelsAdded = item.labelIds ?? [];
        return;
      }

      if (item.message?.id && item.message?.threadId && historyItem.id) {
        newMessages.push({
          messageId: item.message.id,
          threadId: item.message.threadId,
          labelsAdded: item.labelIds ?? [],
          labelsRemoved: [],
          isNew: false,
          wasRemoved: false,
          historyId: historyItem.id,
        });
      }
    });

    historyItem.labelsRemoved?.forEach((item) => {
      const existing = newMessages.find(
        (message) => message.messageId === item.message?.id,
      );
      if (existing) {
        existing.labelsRemoved = item.labelIds ?? [];
        return;
      }
      if (item.message?.id && item.message?.threadId && historyItem.id) {
        newMessages.push({
          messageId: item.message.id,
          threadId: item.message.threadId,
          labelsAdded: [],
          labelsRemoved: item.labelIds ?? [],
          isNew: false,
          wasRemoved: false,
          historyId: historyItem.id,
        });
      }
    });

    messages = messages.concat(newMessages);
  });

  return messages.sort((a, b) => {
    if (a.historyId === b.historyId) {
      return a.messageId > b.messageId ? 1 : -1;
    }
    return a.historyId > b.historyId ? 1 : -1;
  });
}
