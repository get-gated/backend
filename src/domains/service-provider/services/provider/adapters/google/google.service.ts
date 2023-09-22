/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/naming-convention */
import * as Bluebird from 'bluebird';
import { Inject, Injectable } from '@nestjs/common';
import { gmail_v1, google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { MethodOptions } from 'googleapis-common';
import { ConfigType } from '@nestjs/config';
import { parseICS } from 'node-ical';
import { castArray } from 'lodash';
import { createMimeMessage } from 'mimetext';
import { GaxiosPromise, GaxiosResponse } from 'gaxios';
import {
  Label,
  MessageType,
  Status,
  SyncType,
} from '@app/interfaces/service-provider/service-provider.enums';
import InsufficientScopesError from '@app/errors/service-provider/insufficient-scopes.error';
import { ParticipantInterface } from '@app/interfaces/service-provider/participant.interface';
import { CryptoService } from '@app/modules/crypto';
import { LoggerService } from '@app/modules/logger';
import QuotaExceededError from '@app/errors/service-provider/quota-exceeded.error';
import { EventBusService } from '@app/modules/event-bus';
import {
  GenericFunction,
  Maybe,
  UtilsService,
  withRetry,
  WithRetry,
  WithRetryOpts,
} from '@app/modules/utils';
import { MessageChangeInterface } from '@app/interfaces/service-provider/message-change.interface';
import { ConnectionCalendarEventInterface } from '@app/interfaces/service-provider/event.interface';

import ServiceProviderConfig from '../../../../service-provider.config';
import ConnectionEntity from '../../../../entities/connection.entity';
import {
  ProviderAdapterInterface,
  TInsertMessage,
  TPartialMessage,
  TPartialSentMessage,
} from '../provider.adapter.interface';
import {
  CHALLENGE_HEADER,
  MAILING_LIST_HEADER,
  USER_MESSAGE_HEADER,
} from '../../../../service-provider.constants';
import { GMAIL_PUSH_NOTIFICATIONS_TOPIC_NAME } from '../../../../events/gmail-push-notification.event';
import HistoryThreadEntity from '../../../../entities/history-thread.entity';
import { HistoryIdNotFoundError } from '../../../../errors/history-id-not-found.error';
import { MalformedMessageError } from '../../../../errors/malformed-message.error';
import { InvalidTokenError } from '../../../../errors/invalid-token.error';

import {
  mapGmailHistoryToHistoryMessage,
  mapGoogleLabelsToLabels,
  mapToMessageChange,
} from './mappers';
import { GoogleLabel } from './google.enums';
import {
  ConnectionWithHistory,
  EmailMessage,
  GmailMessage,
  HasId,
  HistoryMessage,
  LabelId,
  ListHistoryResponse,
  MessagePage,
} from './types';
import {
  hasId,
  isMessageWithPayload,
  isQuotaError,
  validateHasId,
} from './util';
import { rateLimit } from './rate-limit';
import { HistoryCursor } from './history-cursor';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const addressParser = require('address-rfc2822');

// ts is having a hard time understanding what gmail client method we're calling
interface MessageGet {
  (
    params?: gmail_v1.Params$Resource$Users$Messages$Get,
    options?: MethodOptions,
  ): GaxiosPromise<gmail_v1.Schema$Message>;
}

// ts is having a hard time understanding what gmail client method we're calling
interface SendAsListPatch {
  (
    params: gmail_v1.Params$Resource$Users$Settings$Sendas$Patch,
    options?: MethodOptions,
  ): GaxiosPromise<gmail_v1.Schema$SendAs>;
}

interface EventData {
  participantEmails: string[];
  ownerEmail: string;
}

interface EventDetails {
  participants: ParticipantInterface[];
  isUserOrganizer: boolean;
}

interface LogMeta {
  historyId: string;
  labelId?: string;
}
type RetryOpts = Pick<WithRetryOpts, 'delayMs' | 'maxAttempts'>;

function withHistoryRetry<T extends GenericFunction>(
  fn: T,
  log: LoggerService,
  logMeta: LogMeta,
  retryOpts?: Partial<RetryOpts>,
): WithRetry<T> {
  const opts: RetryOpts = {
    delayMs: 500,
    maxAttempts: 3,
    ...retryOpts,
  };

  return withRetry(fn, {
    ...opts,
    shouldAbort: (error: unknown, attempt: number) => {
      // only retry if it's a not found error
      const notFoundError = error instanceof HistoryIdNotFoundError;
      if (notFoundError) {
        log.warn(
          { ...logMeta, error, attempt },
          `History not found on attempt: ${attempt}`,
        );
      }
      return !notFoundError;
    },
    onSuccess: (attempt: number) => {
      if (attempt > 1) {
        log.info(
          { ...logMeta, attempt, success: true },
          `History found on attempt: ${attempt}`,
        );
      }
    },
  });
}

@Injectable()
export class GoogleService implements ProviderAdapterInterface {
  constructor(
    @Inject(ServiceProviderConfig.KEY)
    private config: ConfigType<typeof ServiceProviderConfig>,
    private log: LoggerService,
    private utils: UtilsService,
    private cryptoService: CryptoService,
    private eventBus: EventBusService,
  ) {}

  private throwIfKnownError(error: any): void {
    if (isQuotaError(error)) {
      this.log.warn({ error }, 'Rate limit exceeded.');
      throw new QuotaExceededError('Provider quota reached. Try again soon.');
    }

    const isInvalidTokenError =
      error.response?.status >= 400 &&
      error.response.status < 500 &&
      error.response.data?.error === 'invalid_grant';

    if (isInvalidTokenError) {
      this.log.warn(
        { error },
        'Invalid grant detected. Assuming token is invalid',
      );
      throw new InvalidTokenError();
    }
  }

  private async oAuth2Client(encryptedToken: string): Promise<OAuth2Client> {
    const auth = new google.auth.OAuth2(
      this.config.google.clientId,
      this.config.google.clientSecret,
      this.config.google.redirectUri,
    );
    auth.setCredentials({
      refresh_token: await this.cryptoService.decrypt(encryptedToken),
    });
    return auth;
  }

  private async gmailClient(encryptedToken: string): Promise<gmail_v1.Gmail> {
    const auth = await this.oAuth2Client(encryptedToken);
    const client = google.gmail({ version: 'v1', auth });

    if (
      process.env.NODE_ENV !== 'test' &&
      this.config.google.gmail.enableRateLimit
    ) {
      return rateLimit(client, encryptedToken, this.log);
    }
    return client;
  }

  private mapLabelsToGoogleLabels(
    connection: ConnectionEntity,
    labels: Label[] = [],
  ): GoogleLabel[] {
    const mappedLabels: GoogleLabel[] = [];

    const map = {
      [Label.Inbox]: GoogleLabel.Inbox,
      [Label.Spam]: GoogleLabel.Spam,
      [Label.Trash]: GoogleLabel.Trash,
      [Label.Important]: GoogleLabel.Important,
      [Label.Sent]: GoogleLabel.Sent,
      [Label.Drafts]: GoogleLabel.Draft,
      [Label.Gated]: connection.gatedLabelId,
      [Label.Donation]: connection.donatedLabelId,
      [Label.Expected]: connection.expectedLabelId,
      [Label.TrainAsAllowed]: connection.trainAsAllowedLabelId,
      [Label.TrainAsGated]: connection.trainAsGatedLabelId,
    };

    for (let i = labels.length - 1; i >= 0; i--) {
      const mappedLabel = (map as any)[labels[i]];
      if (mappedLabel) mappedLabels.push(mappedLabel);
    }

    return mappedLabels;
  }

  private async fetchAndParseIcsFile(
    client: gmail_v1.Gmail,
    attachmentId: string,
    messageId: string,
  ): Promise<EventData | undefined> {
    const attachment = await this.getGmailAttachment(
      client,
      attachmentId,
      messageId,
    );
    // edge case: ignore any ics files somehow over 1mb
    if (attachment.size ?? 0 > 1000000) return;

    if (!attachment.data) {
      return;
    }

    const icalPayload = Buffer.from(attachment.data, 'base64').toString(
      'ascii',
    );
    this.log.info({ icalPayload }, 'Parsing ICS');
    const event = parseICS(icalPayload);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getEmail = (obj: any): Maybe<string> => {
      if (!obj) return;
      const { val } = obj;
      if (val) {
        return val.replace('mailto:', '');
      }
      const cn = obj.params?.CN;
      if (!cn) return;

      if (cn.split('@').length === 2) {
        return cn;
      }
      return undefined;
    };

    let ownerEmail = '';
    const participantEmails: string[] = [];
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const k in event) {
      const ev = event[k];
      if (ev?.type === 'VEVENT') {
        const organizerEmail = getEmail(ev.organizer);
        if (organizerEmail) {
          ownerEmail = organizerEmail;
          if (ownerEmail) {
            participantEmails.push(organizerEmail);
          }
        }
        if (ev.attendee) {
          const attendees = castArray(ev.attendee);
          participantEmails.push(
            ...(attendees.map(getEmail).filter(Boolean) as string[]),
          );
        }
      }
    }

    return {
      participantEmails,
      ownerEmail,
    };
  }

  private async getEventDetails(
    client: gmail_v1.Gmail,
    message: gmail_v1.Schema$Message & {
      id: string;
      payload: gmail_v1.Schema$MessagePart;
    },
    connection: ConnectionEntity,
  ): Promise<Maybe<EventDetails>> {
    try {
      const participants: ParticipantInterface[] = [];

      const { parts } = message.payload;
      if (!parts) return;

      const events = (await Promise.all(
        parts
          .filter(
            (part) =>
              part.mimeType === 'application/ics' && part.body?.attachmentId,
          )
          .map((part) => {
            if (!part.body?.attachmentId) {
              return undefined;
            }
            return this.fetchAndParseIcsFile(
              client,
              part.body.attachmentId,
              message.id,
            );
          })
          .filter((event) => !!event),
      )) as unknown as EventData[];

      if (events.length === 0) return;

      let isUserOrganizer = false;
      let participantEmails: string[] = [];
      events.forEach((event) => {
        if (event.ownerEmail) {
          const normalizedOwner = this.utils.normalizeEmail(
            event.ownerEmail,
          ).email;
          isUserOrganizer =
            normalizedOwner ===
            this.utils.normalizeEmail(connection.emailAddress).email;
        }
        participantEmails.push(...event.participantEmails);
      });

      participantEmails = [...new Set(participantEmails)];
      participants.push(
        ...participantEmails.map((email) => ({
          emailAddress: this.utils.normalizeEmail(email).email,
        })),
      );

      return { participants, isUserOrganizer };
    } catch (error) {
      this.log.error(
        {
          error,
          messageId: message.id,
        },
        'Error getting event detail',
      );
    }
  }

  private containsCalendarEvent({
    parts,
  }: gmail_v1.Schema$MessagePart): boolean {
    if (!parts) {
      return false;
    }
    return (
      parts.filter((part) => part.filename && part.filename.includes('.ics'))
        .length > 0
    );
  }

  private async formatMessage(
    client: gmail_v1.Gmail,
    message: HasId<GmailMessage>,
    connection: ConnectionEntity,
  ): Promise<Omit<EmailMessage, 'connectionId'>> {
    let from: ParticipantInterface | undefined;
    let to: ParticipantInterface[] = [];
    let cc: ParticipantInterface[] = [];
    let bcc: ParticipantInterface[] = [];
    let replyTo: ParticipantInterface[] = [];
    let wasSentBySystem = false;
    let isAutomated = false;
    let isMailingList = false;
    let isDraft = false;

    const labels = message.labelIds
      ? mapGoogleLabelsToLabels(message.labelIds, connection)
      : [];

    const headers = message.payload?.headers ?? [];

    isDraft = !!message.labelIds?.includes(GoogleLabel.Draft);

    const challengeHeader = CHALLENGE_HEADER.toLowerCase();
    const mailingListHeader = MAILING_LIST_HEADER.toLowerCase();
    const userMessageHeader = USER_MESSAGE_HEADER.toLowerCase();

    for (let i = headers.length - 1; i >= 0; i--) {
      const header = headers[i];

      const participants = (): ParticipantInterface[] => {
        if (!header.value) {
          return [];
        }
        try {
          const foundParticipants: ParticipantInterface[] = addressParser
            .parse(header.value)
            .map((item: any) => ({
              emailAddress: item.address,
              displayName: item.name(),
            }));
          return foundParticipants.filter(({ emailAddress }) =>
            Boolean(emailAddress),
          );
        } catch (error) {
          this.log.warn({ error, header }, 'Error parsing header');
          return [];
        }
      };

      switch (header.name?.toLowerCase()) {
        case 'to':
          to = participants();
          break;
        case 'cc':
          cc = participants();
          break;
        case 'bcc':
          bcc = participants();
          break;
        case 'reply-to':
          replyTo = participants();
          break;
        case 'from':
          // eslint-disable-next-line prefer-destructuring
          from = participants()[0];
          break;
        case challengeHeader:
          wasSentBySystem = true;
          break;
        case mailingListHeader:
          isMailingList = true;
          break;
        case userMessageHeader:
          wasSentBySystem = true;
          break;
        case 'auto-submitted':
          isAutomated = true;
          break;
      }
    }
    const type =
      labels.includes(Label.Sent) || labels.includes(Label.Drafts)
        ? MessageType.Sent
        : MessageType.Received;

    if (!to || !from) {
      this.log.warn(
        { malformedMessage: message },
        'To or From not found on message. Skipping',
      );
      throw new MalformedMessageError(
        message,
        'Message malformed. To or From not found',
      );
    }

    const receivedAt = new Date(Number(message.internalDate));

    const hasPayload = isMessageWithPayload(message);
    const hasCalendarEvent =
      hasPayload && this.containsCalendarEvent(message.payload);
    const { fetchAttachments } = this.config.google.gmail.calendar;
    const calendarEvent = await (async (): Promise<
      Maybe<ConnectionCalendarEventInterface>
    > => {
      if (!hasCalendarEvent) {
        return;
      }
      if (fetchAttachments && hasPayload) {
        return this.getEventDetails(client, message, connection);
      }
      return {
        isUserOrganizer: false,
        participants: [],
      };
    })();

    return {
      from,
      to,
      cc,
      bcc,
      replyTo,
      type,
      receivedAt,
      wasSentBySystem,
      isMailingList,
      isAutomated,
      externalMessageId: message.id,
      userId: connection.userId,
      calendarEvent: calendarEvent ?? undefined,
      isDraft,
      labels,
    };
  }

  private async getMessagePage(
    connection: ConnectionEntity,
    labels: GoogleLabel[],
    pageToken?: string,
    q?: string,
    limit = 100,
  ): Promise<MessagePage> {
    const gmail = await this.gmailClient(connection.providerToken);
    let result: GaxiosResponse<gmail_v1.Schema$ListMessagesResponse>;
    try {
      result = await gmail.users.messages.list({
        userId: 'me',
        maxResults: limit,
        labelIds: labels,
        includeSpamTrash: false,
        pageToken,
        q,
      });
    } catch (error) {
      this.throwIfKnownError(error);
      this.log.error({ error }, 'Unsupported error getting gmail message page');
      throw error;
    }

    if (!result.data.messages) {
      return { messages: [] };
    }

    const getMessage = async (
      message: gmail_v1.Schema$Message,
    ): Promise<Maybe<EmailMessage>> => {
      if (!message.id) {
        return;
      }
      try {
        const gmailMessage = await this.getGmailMessage(
          gmail,
          message.id,
          connection,
        );
        return gmailMessage;
      } catch (error) {
        this.log.warn(
          { error, message },
          'Error getting gmail message. Skipping',
        );
        return undefined;
      }
    };

    const messages = (
      await Bluebird.map(result.data.messages, getMessage, { concurrency: 10 })
    ).filter(Boolean) as EmailMessage[];

    return {
      messages,
      nextPageToken: result.data.nextPageToken,
    };
  }

  public async hasSentMessageTo(
    connection: ConnectionEntity,
    emails: string[],
  ): Promise<boolean[]> {
    const gmail = await this.gmailClient(connection.providerToken);

    return Promise.all(
      emails.map(async (email) => {
        try {
          const result = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 1,
            labelIds: [GoogleLabel.Sent],
            includeSpamTrash: false,
            q: `to:${email}`,
          });
          if (!result.data?.messages?.length) {
            return false;
          }
          const { id: messageId } = result.data.messages[0];
          if (!messageId) {
            return false;
          }
          const message = await this.getGmailMessage(
            gmail,
            messageId,
            connection,
          );
          return message ? !message.wasSentBySystem : false;
        } catch (error) {
          this.throwIfKnownError(error);
          throw error;
        }
      }),
    );
  }

  public async recentUnrepliedMessages(
    connection: ConnectionEntity,
  ): Promise<MessagePage> {
    return this.getMessagePage(
      connection,
      [GoogleLabel.Inbox],
      undefined,
      'to:me -filename:.ics -subject:re:',
    );
  }

  public async recentSentMessages(
    connection: ConnectionEntity,
    _pageToken?: string,
    // eslint-disable-next-line default-param-last
    excludeToSelf = false,
    excludeToDomain?: string,
  ): Promise<MessagePage> {
    return this.getMessagePage(
      connection,
      [GoogleLabel.Sent],
      undefined,
      `from:me -label:${GoogleLabel.Draft} ${excludeToSelf && '-to:me'} ${
        excludeToDomain && `-to:@${excludeToDomain}`
      }`,
    );
  }

  public async receivedMessageCount(
    connection: ConnectionEntity,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const formatDate = (date: Date): string =>
      `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    const after = formatDate(startDate);
    const before = formatDate(endDate);

    let count = 0;
    const gmail = await this.gmailClient(connection.providerToken);

    const getPage = async (pageToken?: string): Promise<void> => {
      const result = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 500,
        includeSpamTrash: false,
        pageToken,
        q: `to:me after:${after} before:${before}`,
      });

      if (!result.data.messages) return;
      count += result.data.messages.length;
      if (result.data.nextPageToken) return getPage(result.data.nextPageToken);
    };
    await getPage();
    return count;
  }

  public async syncMessages(
    connection: ConnectionEntity,
    type: SyncType,
    pageToken: string,
  ): Promise<MessagePage> {
    let q: string;
    let labels: GoogleLabel[] = [];
    switch (type) {
      case SyncType.Sent:
        labels = [GoogleLabel.Sent];
        q = `from:me -label:${GoogleLabel.Draft} -label:${GoogleLabel.Chat}`;
        break;
      case SyncType.Received:
        q = `to:me -label:${GoogleLabel.Spam}  -label:${GoogleLabel.Chat}`;
        break;
      default:
        throw new Error('Unsupported message sync type');
    }

    return this.getMessagePage(connection, labels, pageToken, q);
  }

  async disconnect(
    connection: ConnectionEntity,
    destroyTokens = true,
  ): Promise<void> {
    try {
      const client = await this.gmailClient(connection.providerToken);
      await this.stopWatch(client);
    } catch (error) {
      this.log.warn(
        { error },
        'Error disconnecting account. Attempting to proceed anyhow.',
      );
    }

    try {
      if (destroyTokens && connection.providerToken) {
        const auth = await this.oAuth2Client(connection.providerToken);
        const { token } = await auth.getAccessToken();
        if (token) {
          await auth.revokeToken(token);
        }
      }
    } catch (error) {
      this.log.warn(
        { error },
        'Error destroying tokens. Attempting to proceed anyhow.',
      );
    }
  }

  async connect(connection: ConnectionEntity): Promise<void> {
    try {
      const client = await this.gmailClient(connection.providerToken);
      const historyId = await this.watch(client, connection);
      // eslint-disable-next-line no-param-reassign
      connection.lastHistoryId = historyId;
    } catch (e: any) {
      if (
        e.response?.status >= 400 &&
        e.response.status < 500 &&
        e.message === 'Insufficient Permission'
      ) {
        throw new InsufficientScopesError();
      } else {
        throw e;
      }
    }
  }

  private getGmailHeaderValue(
    headerName: string,
    headers: gmail_v1.Schema$MessagePartHeader[],
  ): string {
    const result = headers.find(
      (header) => header.name?.toLowerCase() === headerName.toLowerCase(),
    );
    return result?.value ?? '';
  }

  public async sendReply(
    connection: ConnectionEntity,
    externalMessageId: string,
    body: string,
    to: string,
  ): Promise<TPartialSentMessage> {
    const client = await this.gmailClient(connection.providerToken);

    const gmailMessage = await client.users.messages.get({
      userId: 'me',
      quotaUser: 'me',
      id: externalMessageId,
      format: 'metadata',
      metadataHeaders: ['Subject', 'Message-ID'],
    });

    const subject =
      this.getGmailHeaderValue(
        'subject',
        gmailMessage.data.payload?.headers ?? [],
      ) || 'No Subject';
    const messageId = this.getGmailHeaderValue(
      'message-id',
      gmailMessage.data.payload?.headers ?? [],
    );

    const msg = createMimeMessage();
    msg.setSender({ addr: connection.emailAddress });
    msg.setRecipient(to);
    msg.setSubject(subject);
    msg.setMessage('text/html', body);
    msg.setHeader(CHALLENGE_HEADER, 'true');
    msg.setHeader('Auto-Submitted', 'auto-replied');
    msg.setHeader('In-Reply-To', messageId);
    msg.setHeader('Reference', messageId);

    try {
      const reply = await client.users.messages.send({
        userId: 'me',
        quotaUser: 'me',
        requestBody: {
          raw: Buffer.from(msg.asRaw()).toString('base64'),
          threadId: gmailMessage.data.threadId,
        },
      });

      const sentGmailMessage = await client.users.messages.get({
        userId: 'me',
        quotaUser: 'me',
        id: reply.data.id as string,
      });
      const message = await this.formatMessage(
        client,
        validateHasId(sentGmailMessage.data),
        connection,
      );
      return {
        ...message,
        connection,
        wasSentBySystem: true,
      } as TPartialSentMessage;
    } catch (error) {
      this.throwIfKnownError(error);
      throw error;
    }
  }

  async moveThreadToGated(
    connection: ConnectionEntity,
    thread: HistoryThreadEntity,
  ): Promise<void> {
    const removeLabels = [connection.donatedLabelId, GoogleLabel.Inbox];
    if (connection.trainAsGatedLabelId) {
      removeLabels.push(connection.trainAsGatedLabelId);
    }
    await this.updateThreadLabels(
      connection,
      thread,
      [connection.gatedLabelId],
      removeLabels,
    );
  }

  async moveThreadToDonated(
    connection: ConnectionEntity,
    thread: HistoryThreadEntity,
  ): Promise<void> {
    await this.updateThreadLabels(
      connection,
      thread,
      [connection.donatedLabelId, GoogleLabel.Inbox],
      [
        connection.gatedLabelId,
        GoogleLabel.Spam,
        GoogleLabel.CategoryPromotions,
        GoogleLabel.CategoryUpdates,
        GoogleLabel.CategoryPersonal,
        GoogleLabel.CategorySocial,
        GoogleLabel.CategoryForums,
      ],
    );
  }

  async moveThreadToInbox(
    connection: ConnectionEntity,
    thread: HistoryThreadEntity,
  ): Promise<void> {
    const removeLabels = [
      connection.gatedLabelId,
      GoogleLabel.Spam,
      GoogleLabel.CategoryPromotions,
      GoogleLabel.CategoryUpdates,
      GoogleLabel.CategoryPersonal,
      GoogleLabel.CategorySocial,
      GoogleLabel.CategoryForums,
    ];
    if (connection.trainAsAllowedLabelId) {
      removeLabels.push(connection.trainAsAllowedLabelId);
    }
    await this.updateThreadLabels(
      connection,
      thread,
      [GoogleLabel.Inbox],
      removeLabels,
    );
  }

  private async updateThreadLabels(
    connection: ConnectionEntity,
    thread: HistoryThreadEntity,
    addLabels: string[],
    removeLabels: string[],
  ): Promise<void> {
    const client = await this.gmailClient(connection.providerToken);

    await client.users.threads.modify({
      userId: 'me',
      quotaUser: 'me',
      id: thread.externalThreadId,
      requestBody: {
        addLabelIds: addLabels,
        removeLabelIds: removeLabels,
      },
    });
  }

  async checkGatedLabels(connection: ConnectionEntity): Promise<void> {
    const client = await this.gmailClient(connection.providerToken);
    let labelsList: gmail_v1.Schema$ListLabelsResponse;
    try {
      const res = await client.users.labels.list({
        userId: 'me',
        quotaUser: 'me',
      });
      labelsList = res.data;
    } catch (error) {
      this.throwIfKnownError(error);
      throw error;
    }

    const gatedLabel = this.upsertLabel(
      client,
      labelsList,
      this.config.labels.gated.displayName,
      this.config.labels.gated.textColor,
      this.config.labels.gated.backgroundColor,
      connection.gatedLabelId,
    );
    connection.gatedLabelId = await gatedLabel;
    // ensure we have the gated label saved first before continuing as it causes problems otherwise

    // todo: remove after all expected labels have been removed for users
    const expectedLabel = async (): Promise<string> => {
      if (connection.expectedLabelId) {
        try {
          await this.deleteLabel(client, connection.expectedLabelId);
        } catch (error) {
          this.log.error({ error }, 'error deleting expected label');
        }
      }
      return '';
    };

    const donatedLabel = this.upsertLabel(
      client,
      labelsList,
      `${this.config.labels.gated.displayName}/${this.config.labels.donated.displayName}`,
      this.config.labels.donated.textColor,
      this.config.labels.donated.backgroundColor,
      connection.donatedLabelId,
    );

    const trainAsAllowedLabel = this.upsertLabel(
      client,
      labelsList,
      `${this.config.labels.gated.displayName}/${this.config.labels.trainAsAllowed.displayName}`,
      this.config.labels.trainAsAllowed.textColor,
      this.config.labels.trainAsAllowed.backgroundColor,
      connection.trainAsAllowedLabelId,
    );

    const trainAsGatedLabel = this.upsertLabel(
      client,
      labelsList,
      `${this.config.labels.gated.displayName}/${this.config.labels.trainAsGated.displayName}`,
      this.config.labels.trainAsGated.textColor,
      this.config.labels.trainAsGated.backgroundColor,
      connection.trainAsGatedLabelId,
    );

    const result = await Promise.all([
      expectedLabel(),
      donatedLabel,
      trainAsAllowedLabel,
      trainAsGatedLabel,
    ]);

    /* eslint-disable no-param-reassign */
    connection.expectedLabelId = result[0];
    connection.donatedLabelId = result[1];
    connection.trainAsAllowedLabelId = result[2];
    connection.trainAsGatedLabelId = result[3];
    /* eslint-enable no-param-reassign */
  }

  private async deleteLabel(
    client: gmail_v1.Gmail,
    labelId: string,
  ): Promise<void> {
    await client.users.labels.delete({
      userId: 'me',
      quotaUser: 'me',
      id: labelId,
    });
  }

  private async upsertLabel(
    client: gmail_v1.Gmail,
    labelsList: gmail_v1.Schema$ListLabelsResponse,
    displayName: string,
    displayTextColor?: string,
    displayBgColor?: string,
    labelId?: string,
  ): Promise<string> {
    try {
      const labelNameMatch = (label: gmail_v1.Schema$Label): boolean =>
        label.name?.toLowerCase() === displayName.toLowerCase();
      const labelColorMatch = (label: gmail_v1.Schema$Label): boolean => {
        if (!displayBgColor || !displayTextColor) return true;
        if (label.color) {
          return (
            label.color?.backgroundColor === displayBgColor &&
            label.color?.textColor === displayTextColor
          );
        }
        return false;
      };
      const getColor = (): any => {
        if (displayTextColor && displayBgColor) {
          return {
            textColor: displayTextColor,
            backgroundColor: displayBgColor,
          };
        }
      };

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const updateLabel = async () => {
        await client.users.labels.update({
          userId: 'me',
          quotaUser: 'me',
          id: labelId,
          requestBody: {
            name: displayName,
            color: getColor(),
          },
        });
      };

      if (labelId) {
        const existingById = (labelsList.labels ?? []).find(
          (label) => label.id === labelId,
        );

        if (existingById) {
          if (!labelNameMatch(existingById) || !labelColorMatch(existingById)) {
            await updateLabel();
          }
          // id has to exist if it matched the given labelId
          return existingById.id as string;
        }
      }

      const existingByName = labelsList.labels?.find((label) =>
        labelNameMatch(label),
      );
      if (existingByName) {
        // eslint-disable-next-line no-param-reassign
        labelId = existingByName.id as string;
        if (
          !labelColorMatch(existingByName) || // handle color differences
          existingByName.name !== displayName // handle case differences
        )
          await updateLabel();
        return labelId;
      }

      const newLabel = await client.users.labels.create({
        userId: 'me',
        quotaUser: 'me',
        requestBody: {
          name: displayName,
          color: getColor(),
        },
      });

      return newLabel.data.id as string;
    } catch (error) {
      this.throwIfKnownError(error);
      throw error;
    }
  }

  public async getGmailMessage(
    client: gmail_v1.Gmail,
    messageId: string,
    connection: ConnectionEntity,
  ): Promise<Maybe<EmailMessage>> {
    try {
      const response = await client.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });

      if (!hasId(response.data)) {
        this.log.warn(
          { response, messageId, connectionId: connection.connectionId },
          'Invalid data received for gmail message',
        );
        return;
      }
      const formattedMessage = await this.formatMessage(
        client,
        response.data,
        connection,
      );

      return {
        ...formattedMessage,
        userId: connection.userId,
        connectionId: connection.connectionId,
      };
    } catch (error) {
      this.throwIfKnownError(error);
      throw error;
    }
  }

  private async getGmailAttachment(
    client: gmail_v1.Gmail,
    attachmentId: string,
    messageId: string,
  ): Promise<gmail_v1.Schema$MessagePartBody> {
    try {
      const gmailAttachment = await client.users.messages.attachments.get({
        userId: 'me',
        id: attachmentId,
        messageId,
      });
      return gmailAttachment.data;
    } catch (error) {
      this.throwIfKnownError(error);
      throw error;
    }
  }

  public async insertLabelInstructions(
    connection: ConnectionEntity,
  ): Promise<void> {
    if (!this.config.labelInstructionMessages?.common?.fromAddress) return;
    const client = await this.gmailClient(connection.providerToken);
    const to = connection.emailAddress;
    const { fromAddress } = this.config.labelInstructionMessages.common;
    const { fromName } = this.config.labelInstructionMessages.common;
    const {
      gatedLabelNameVariable,
      trainAsAllowedLabelNameVariable,
      trainAsGatedLabelNameVariable,
    } = this.config.labelInstructionMessages.common;

    const replaceLabelName = (text: string): string =>
      text
        .replace(
          new RegExp(gatedLabelNameVariable, 'g'),
          this.config.labels.gated.displayName,
        )
        .replace(
          new RegExp(trainAsAllowedLabelNameVariable, 'g'),
          this.config.labels.trainAsAllowed.displayName,
        )
        .replace(
          new RegExp(trainAsGatedLabelNameVariable, 'g'),
          this.config.labels.trainAsGated.displayName,
        );
    const gatedInstructions =
      this.config.labelInstructionMessages.gated?.subject &&
      this.insertGmailMessage(
        client,
        [connection.gatedLabelId, GoogleLabel.Starred, GoogleLabel.Unread],
        fromAddress,
        fromName,
        to,
        replaceLabelName(this.config.labelInstructionMessages.gated.body),
        replaceLabelName(this.config.labelInstructionMessages.gated.subject),
      );

    const trainAsGatedInstructionsLables = [
      GoogleLabel.Starred,
      GoogleLabel.Unread,
    ];
    if (connection.trainAsAllowedLabelId) {
      trainAsGatedInstructionsLables.push(
        connection.trainAsAllowedLabelId as GoogleLabel,
      );
    }
    const trainAsGatedInstructions =
      this.config.labelInstructionMessages.trainAsGated?.subject &&
      this.insertGmailMessage(
        client,
        trainAsGatedInstructionsLables,
        fromAddress,
        fromName,
        to,
        replaceLabelName(
          this.config.labelInstructionMessages.trainAsGated.body,
        ),
        replaceLabelName(
          this.config.labelInstructionMessages.trainAsGated.subject,
        ),
      );

    const trainAsAllowedInstructions =
      this.config.labelInstructionMessages.trainAsAllowed?.subject &&
      this.insertGmailMessage(
        client,
        trainAsGatedInstructionsLables,
        fromAddress,
        fromName,
        to,
        replaceLabelName(
          this.config.labelInstructionMessages.trainAsAllowed.body,
        ),
        replaceLabelName(
          this.config.labelInstructionMessages.trainAsAllowed.subject,
        ),
      );

    await Promise.all([
      gatedInstructions,
      trainAsGatedInstructions,
      trainAsAllowedInstructions,
    ]);
  }

  public async insertMessage(
    connection: ConnectionEntity,
    message: TInsertMessage,
  ): Promise<TPartialMessage> {
    const client = await this.gmailClient(connection.providerToken);
    const labels = this.mapLabelsToGoogleLabels(connection, message.labels);

    if (message.isStarred) labels.push(GoogleLabel.Starred);
    if (message.isUnread) labels.push(GoogleLabel.Unread);

    const res = await this.insertGmailMessage(
      client,
      labels,
      message.fromEmail,
      message.fromName,
      connection.emailAddress,
      message.body,
      message.subject,
      message.replyToMessageExternalId,
      message.insertInThreadWithMessageExternalId,
      message.internalDate,
    );

    try {
      // message returned from an insert is no fully fleshed out, get it first
      // ts is confused with the overloaded types
      const gmailMessage = await (client.users.messages.get as MessageGet)({
        userId: 'me',
        quotaUser: 'me',
        id: res.id,
        format: 'full',
      });
      const insertedMessage = gmailMessage.data;

      return this.formatMessage(
        client,
        validateHasId(insertedMessage),
        connection,
      );
    } catch (error) {
      // rollback the inserted message
      await client.users.messages.delete({
        userId: 'me',
        quotaUser: 'me',
        id: res.id,
      });
      this.throwIfKnownError(error);
      throw error;
    }
  }

  private async insertGmailMessage(
    client: gmail_v1.Gmail,
    labels: (string | GoogleLabel)[],
    fromAddress: string,
    fromName: string | undefined,
    to: string,
    body: string,
    subject?: string,
    replyToMessageId?: string,
    insertInThreadWithMessageId?: string,
    internalDate?: Date,
  ): Promise<HasId<GmailMessage>> {
    const msg = createMimeMessage();
    msg.setSender({ addr: fromAddress, name: fromName });
    msg.setRecipient(to);
    msg.setMessage('text/html', body);
    msg.setHeader(USER_MESSAGE_HEADER, 'true');
    let threadId: Maybe<string>;
    let subjectText: Maybe<string> = subject;
    if (replyToMessageId || insertInThreadWithMessageId) {
      const replyTo = await client.users.messages.get({
        userId: 'me',
        quotaUser: 'me',
        id: replyToMessageId,
        format: 'metadata',
      });

      if (!hasId(replyTo.data)) {
        this.log.warn(
          { result: replyTo },
          'possible invalid message for replyTo',
        );
      }

      const replyToHeaders = replyTo.data.payload?.headers ?? [];
      const messageId = this.getGmailHeaderValue('message-id', replyToHeaders);
      if (replyToMessageId) {
        msg.setHeader('In-Reply-To', messageId);
      }
      msg.setHeader('Reference', messageId);

      threadId = replyTo.data.threadId;
      subjectText = replyToHeaders.find(
        (header) => header.name?.toLowerCase() === 'subject',
      )?.value;
    }

    if (internalDate) {
      msg.setHeader('Date', internalDate.toUTCString());
    }

    if (subjectText) {
      msg.setSubject(subjectText);
    }

    if (!subjectText)
      throw new Error('Subject is required. Either not provided or not found');

    try {
      const response = await client.users.messages.insert({
        userId: 'me',
        quotaUser: 'me',
        internalDateSource: 'dateHeader',
        requestBody: {
          labelIds: labels,
          raw: Buffer.from(msg.asRaw()).toString('base64'),
          threadId,
          internalDate: (internalDate || new Date()).getTime().toString(),
        },
      });

      const message = response.data;
      return validateHasId(message);
    } catch (error) {
      this.throwIfKnownError(error);
      throw error;
    }
  }

  public async renewWatch(connection: ConnectionEntity): Promise<void> {
    const client = await this.gmailClient(connection.providerToken);
    const lastHistoryId = await this.watch(client, connection);
    connection.lastHistoryId = lastHistoryId;
  }

  private async watch(
    client: gmail_v1.Gmail,
    connection: ConnectionEntity,
  ): Promise<string | undefined> {
    if (this.config.disableGmailPushNotifications) {
      this.log.warn(
        'Gmail push notifications disabled in config. Skipping watch.',
      );
      return;
    }
    try {
      const projectId = this.config.google.gmailPushNotificationProjectId;

      const res = await (client.users as any).watch({
        userId: 'me',
        quotaUser: 'me',
        requestBody: {
          labelIds: [
            GoogleLabel.Inbox,
            GoogleLabel.Sent,
            connection.trainAsAllowedLabelId,
            connection.trainAsGatedLabelId,
          ],
          topicName: `projects/${projectId}/topics/${this.eventBus.getTopicName(
            GMAIL_PUSH_NOTIFICATIONS_TOPIC_NAME,
          )}`,
        },
      });
      return res.data?.historyId;
    } catch (error) {
      this.throwIfKnownError(error);
      throw error;
    }
  }

  private async stopWatch(client: gmail_v1.Gmail): Promise<void> {
    await client.users.stop({ userId: 'me', quotaUser: 'me' });
  }

  private async fetchHistory(
    client: gmail_v1.Gmail,
    startHistoryId: string,
    labelId?: LabelId,
    pageToken?: string,
  ): Promise<ListHistoryResponse> {
    const opts = {
      pageToken,
      startHistoryId,
      labelId,
    };
    try {
      return client.users.history.list({
        userId: 'me',
        quotaUser: 'me',
        ...opts,
      });
    } catch (error: any) {
      this.throwIfKnownError(error);
      if (error.response?.status === 404) {
        throw new HistoryIdNotFoundError();
      }
      this.log.warn({ error, opts }, `Error fetching history list`);
      throw error;
    }
  }

  /**
   * Get all history from starting history id.
   */
  private async getHistory(
    client: gmail_v1.Gmail,
    startHistoryId: string,
    labelId?: GoogleLabel | string,
  ): Promise<gmail_v1.Schema$History[]> {
    let history: gmail_v1.Schema$History[] = [];

    const getPage = async (pageToken?: string): Promise<void> => {
      const res: GaxiosResponse<gmail_v1.Schema$ListHistoryResponse> =
        await this.fetchHistory(client, startHistoryId, labelId, pageToken);

      if (res.data.history) history = history.concat(res.data.history);

      if (res.data.nextPageToken) return getPage(res.data.nextPageToken);
    };
    const getPageWithRetry = withHistoryRetry(
      getPage,
      this.log,
      {
        historyId: startHistoryId,
        labelId,
      },
      this.config.google.gmailHistory?.getHistoryRetry,
    );
    await getPageWithRetry();
    return history;
  }

  /**
   * @deprecated
   */
  public async getMessageChangesFromHistory(
    connection: ConnectionEntity,
  ): Promise<MessageChangeInterface[]> {
    const client = await this.gmailClient(connection.providerToken);

    const { lastHistoryId: historyId } = connection;

    if (!historyId) {
      return [];
    }

    // consolidates multiple history events per message
    const historyMessages = mapGmailHistoryToHistoryMessage(
      await this.getHistory(client, historyId),
    );

    const messageChanges: Maybe<MessageChangeInterface>[] = await Bluebird.map(
      historyMessages,
      async (historyMessage: HistoryMessage) => {
        const message: Maybe<EmailMessage> = await this.getGmailMessage(
          client,
          historyMessage.messageId,
          connection,
        ).catch((error): null => {
          this.log.warn(
            { error },
            'Error getting message in change. Skipping.',
          );
          return null;
        });
        return (
          message && mapToMessageChange(connection, message, historyMessage)
        );
      },
      { concurrency: this.config.google.gmail.messageChangeConcurrency },
    );

    return messageChanges.filter(
      (message) => !!message,
    ) as MessageChangeInterface[];
  }

  public async getMessageChangesFromHistoryMessages(
    client: gmail_v1.Gmail,
    connection: ConnectionEntity,
    historyMessages: HistoryMessage[],
  ): Promise<MessageChangeInterface[]> {
    const messageChanges: Maybe<MessageChangeInterface>[] = await Bluebird.map(
      historyMessages,
      async (historyMessage: HistoryMessage) => {
        const message: Maybe<EmailMessage> = await this.getGmailMessage(
          client,
          historyMessage.messageId,
          connection,
        ).catch((error): null => {
          this.log.warn(
            { error },
            'Error getting message in change. Skipping.',
          );
          return null;
        });
        return (
          message && mapToMessageChange(connection, message, historyMessage)
        );
      },
      { concurrency: this.config.google.gmail.messageChangeConcurrency },
    );

    return messageChanges.filter(
      (message) => !!message,
    ) as MessageChangeInterface[];
  }

  public async getPaginatedHistory({
    lastHistoryId,
    providerToken,
  }: ConnectionWithHistory): Promise<HistoryCursor> {
    try {
      const client = await this.gmailClient(providerToken);

      const result = await this.fetchHistory(client, lastHistoryId);

      return new HistoryCursor(
        client,
        lastHistoryId,
        this.fetchHistory.bind(this),
        undefined,
        result.data,
      );
    } catch (error) {
      this.throwIfKnownError(error);
      throw error;
    }
  }

  async getConnectionStatus(connection: ConnectionEntity): Promise<Status> {
    return connection.status;
  }

  async isProviderTokenValid(connection: ConnectionEntity): Promise<boolean> {
    try {
      await this.getMessagePage(
        connection,
        [GoogleLabel.Inbox],
        undefined,
        undefined,
        1,
      );
      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        return false;
      }
      this.log.error({ error }, 'Error checking provider token validity');
      throw error;
    }
  }

  isBounced(message: TPartialMessage): boolean {
    return message.from.emailAddress === 'mailer-daemon@googlemail.com';
  }

  async updateEmailAddress(connection: ConnectionEntity): Promise<void> {
    try {
      const client = await this.gmailClient(connection.providerToken);
      const res = await client.users.getProfile({
        userId: 'me',
        quotaUser: 'me',
      });
      const { emailAddress } = res.data;
      if (emailAddress && emailAddress !== connection.emailAddress) {
        connection.emailAddress = emailAddress;
      }
    } catch (error) {
      this.throwIfKnownError(error);
      throw error;
    }
  }

  public async addSignature(
    connection: ConnectionEntity,
    signature: string,
  ): Promise<void> {
    const client = await this.gmailClient(connection.providerToken);

    const result = await client.users.settings.sendAs.list({
      userId: 'me',
    });

    const sendAs = result.data.sendAs?.find((s) => s.isPrimary);
    if (!sendAs?.sendAsEmail) {
      this.log.warn(
        { sendAsListResponse: result },
        'sendAs list does not have a primary address',
      );
      return;
    }

    const newSignature = `${sendAs?.signature ?? ''} ${signature}`;

    await (client.users.settings.sendAs.patch as SendAsListPatch)({
      userId: 'me',
      sendAsEmail: sendAs.sendAsEmail,
      requestBody: {
        signature: newSignature,
      },
    });
  }
}
