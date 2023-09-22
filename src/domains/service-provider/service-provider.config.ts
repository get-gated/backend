import { envOrFail } from '@app/modules/utils';
import { registerAs } from '@nestjs/config';

interface Label {
  displayName: string;
  backgroundColor?: string;
  textColor?: string;
}
interface LabelInstructionMessage {
  subject: string;
  body: string;
}

export interface ServiceProviderConfig {
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    gmailPushNotificationProjectId: string;
    gmailHistory: {
      getHistoryRetry: {
        delayMs: number;
        maxAttempts: number;
      };
    };
    gmail: {
      getMessageRetry: {
        delayMs: number;
        maxAttempts: number;
      };
      messageChangeConcurrency: number;
      enableRateLimit: boolean;
      calendar: {
        fetchAttachments: boolean;
      };
    };
  };
  initialSyncDepthInMonths: number;
  labels: {
    gated: Label;
    expected: Label;
    donated: Label;
    trainAsGated: Label;
    trainAsAllowed: Label;
  };
  labelInstructionMessages?: {
    common?: {
      fromName: string;
      fromAddress: string;
      gatedLabelNameVariable: string;
      trainAsGatedLabelNameVariable: string;
      trainAsAllowedLabelNameVariable: string;
    };
    gated?: LabelInstructionMessage;
    trainAsAllowed?: LabelInstructionMessage;
    trainAsGated?: LabelInstructionMessage;
  };
  messageUpdatedTolerances: {
    webhookDebounceMs: number;
    labelChangeCushionSec: number;
  };
  latentMessageThresholdInSec: number;
  removeConnectionsInvalidForDays: number;
  historyCatchUpLatencyUpInMin?: number; // If we dont get a history event from google in this many mins, check ourselves
  disableGmailPushNotifications: boolean; // dev setting to not watch for gmail push notifications on accounts so you dont need to connect to real pubsub environment for non-gmail integration testing
}

export default registerAs(
  'serviceProvider',
  (): ServiceProviderConfig => ({
    google: {
      clientId: envOrFail('GOOGLE_CLIENT_ID'),
      clientSecret: envOrFail('GOOGLE_CLIENT_SECRET'),
      redirectUri: process.env.GOOGLE_REDIRECT_URI ?? '',
      gmailPushNotificationProjectId: envOrFail(
        'GOOGLE_GMAIL_PUSH_NOTIFICATION_PROJECT_ID',
      ),
      gmailHistory: {
        getHistoryRetry: {
          delayMs:
            Number(process.env.GOOGLE_GMAIL_HISTORY_RETRY_DELAY_MS ?? 0) || 500,
          maxAttempts:
            Number(process.env.GOOGLE_GMAIL_HISTORY_RETRY_MAX_ATTEMPTS ?? 0) ||
            3,
        },
      },
      gmail: {
        calendar: {
          fetchAttachments: process.env.GOOGLE_GMAIL_CALENDAR_FETCH_ATTACHMENTS
            ? process.env.GOOGLE_GMAIL_CALENDAR_FETCH_ATTACHMENTS === 'true'
            : false,
        },
        getMessageRetry: {
          delayMs:
            Number(process.env.GOOGLE_GMAIL_MESSAGE_RETRY_DELAY_MS ?? 0) || 500,
          maxAttempts:
            Number(process.env.GOOGLE_GMAIL_MESSAGE_RETRY_MAX_ATTEMPTS ?? 0) ||
            4,
        },
        enableRateLimit: process.env.GOOGLE_GMAIL_ENABLE_RATE_LIMIT
          ? process.env.GOOGLE_GMAIL_ENABLE_RATE_LIMIT === 'true'
          : true,
        messageChangeConcurrency:
          Number(process.env.GOOGLE_GMAIL_MESSAGE_CHANGE_CONCURRENCY ?? 0) ||
          10,
      },
    },
    initialSyncDepthInMonths: Number(
      process.env.SERVICE_PROVIDER_INITIAL_SYNC_DEPTH,
    ),
    labels: {
      gated: {
        displayName: process.env.SERVICE_PROVIDER_LABEL_GATED || '@Gated',
        backgroundColor: process.env.SERVICE_PROVIDER_LABEL_GATED_BG_COLOR,
        textColor: process.env.SERVICE_PROVIDER_LABEL_GATED_TEXT_COLOR,
      },
      expected: {
        displayName: process.env.SERVICE_PROVIDER_LABEL_EXPECTED || 'Expected',
      },
      donated: {
        displayName: process.env.SERVICE_PROVIDER_LABEL_DONATED || 'Donated',
      },
      trainAsGated: {
        displayName:
          process.env.SERVICE_PROVIDER_LABEL_TRAIN_AS_GATED ||
          '⤵Remove from Allow List',
        backgroundColor:
          process.env.SERVICE_PROVIDER_LABEL_TRAIN_AS_GATED_BG_COLOR,
        textColor: process.env.SERVICE_PROVIDER_LABEL_TRAIN_AS_GATED_TEXT_COLOR,
      },
      trainAsAllowed: {
        displayName:
          process.env.SERVICE_PROVIDER_LABEL_TRAIN_AS_ALLOWED ||
          '⤵Add to Allow List',
        backgroundColor:
          process.env.SERVICE_PROVIDER_LABEL_TRAIN_AS_ALLOWED_BG_COLOR,
        textColor:
          process.env.SERVICE_PROVIDER_LABEL_TRAIN_AS_ALLOWED_TEXT_COLOR,
      },
    },
    labelInstructionMessages: {
      common: {
        fromAddress:
          process.env.SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_FROM_ADDRESS ??
          '',
        fromName:
          process.env.SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_FROM_NAME ?? '',
        gatedLabelNameVariable:
          process.env
            .SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_GATED_LABEL_NAME_VARIABLE ??
          '',
        trainAsGatedLabelNameVariable:
          process.env
            .SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_TRAIN_AS_GATED_LABEL_NAME_VARIABLE ??
          '',
        trainAsAllowedLabelNameVariable:
          process.env
            .SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_TRAIN_AS_ALLOWED_LABEL_NAME_VARIABLE ??
          '',
      },
      gated: {
        subject:
          process.env.SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_GATED_SUBJECT ??
          '',
        body:
          process.env.SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_GATED_BODY ??
          '',
      },
      trainAsAllowed: {
        subject:
          process.env
            .SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_TRAIN_AS_ALLOWED_SUBJECT ??
          '',
        body:
          process.env
            .SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_TRAIN_AS_ALLOWED_BODY ??
          '',
      },
      trainAsGated: {
        subject:
          process.env
            .SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_TRAIN_AS_GATED_SUBJECT ??
          '',
        body:
          process.env
            .SERVICE_PROVIDER_LABEL_INSRUCTION_MESSAGE_TRAIN_AS_GATED_BODY ??
          '',
      },
    },
    messageUpdatedTolerances: {
      webhookDebounceMs: Number(
        process.env.SERVICE_PROVIDER_MESSAGE_UPDATE_DEBOUNCE_MS,
      ),
      labelChangeCushionSec: Number(
        process.env.SERVICE_PROVIDER_MESSAGE_LABEL_CHANGE_CUSHION_SEC,
      ),
    },
    removeConnectionsInvalidForDays: Number(
      process.env.SERVICE_PROVIDER_REMOVE_CONNECTIONS_INVALID_FOR_DAYS || 7,
    ),
    latentMessageThresholdInSec: Number(
      process.env.SERVICE_PROVIDER_LATENT_MESSAGE_THRESHOLD_IN_SEC,
    ),
    historyCatchUpLatencyUpInMin: process.env
      .SERVICE_PROVIDER_HISTORY_CATCH_UP_LATENCY_IN_MIN
      ? Number(process.env.SERVICE_PROVIDER_HISTORY_CATCH_UP_LATENCY_IN_MIN)
      : undefined,
    disableGmailPushNotifications: Boolean(
      process.env.SERVICE_PROVIDER_DISABLE_GMAIL_PUSH_NOTIFICATIONS === 'true',
    ),
  }),
);
