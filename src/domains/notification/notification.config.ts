import { registerAs } from '@nestjs/config';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { envOrFail } from '@app/modules/utils';

type Templates = {
  [one in Transaction]: string;
};

type NotificationConfig = {
  sendgrid: {
    apiKey: string;
    templates: Templates;
  };
  txEmailFromAddress: string;
  txEmailFromName: string;
  txEmailBccAddress: string;
  txEmailNoBcc: Transaction[];
  alertAddress: {
    userJoined: string;
    userOffboarded: string;
    donationMade: string;
    userSignupAttempted: string;
    donationRequestDonated: string;
  };
  expo: {
    accessToken: string;
  };
};

export default registerAs(
  'notification',
  (): NotificationConfig => ({
    sendgrid: {
      apiKey: envOrFail('NOTIFICATION_SENDGRID_API_KEY'),
      templates: {
        [Transaction.FirstExpected]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_FIRST_EXPECTED',
        ),
        [Transaction.FirstDonationReceived]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_FIRST_DONATION_RECEIVED',
        ),
        [Transaction.DonationReceived]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_DONATION_RECEIVED',
        ),
        [Transaction.FirstConnectionReady]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_FIRST_CONNECTION_READY',
        ),
        [Transaction.ConnectionReady]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_CONNECTION_READY',
        ),
        [Transaction.ConnectionStopped]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_CONNECTION_STOPPED',
        ),
        [Transaction.ConnectionResumed]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_CONNECTION_RESUMED',
        ),
        [Transaction.ConnectionRemoved]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_CONNECTION_REMOVED',
        ),
        [Transaction.ReceiptExpected]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_RECEIPT_EXPECTED',
        ),
        [Transaction.ReceiptDonation]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_RECEIPT_DONATION',
        ),
        [Transaction.AccountRemoved]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_ACCOUNT_REMOVED',
        ),
        [Transaction.PendingFirstConnection]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_PENDING_FIRST_CONNECTION',
        ),
        [Transaction.AllowedMessageToUser]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_ALLOWED_MESSAGE_TO_USER',
        ),
        [Transaction.AllowedMessageToUserGatedUser]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_ALLOWED_MESSAGE_TO_USER_GATED_USER',
        ),
        [Transaction.AllowedMessageToUserSameDomain]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_ALLOWED_MESSAGE_TO_USER_SAME_DOMAIN',
        ),
        [Transaction.ExpectedConsentRequested]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_EXPECTED_CONSENT_REQUESTED',
        ),
        [Transaction.ReceiptExemptionRequested]: envOrFail(
          'NOTIFICATION_SENDGRID_TEMPLATE_RECEIPT_EXEMPTION_REQUESTED',
        ),
      },
    },
    txEmailFromAddress: envOrFail('NOTIFICATION_TX_EMAIL_FROM_ADDRESS'),
    txEmailFromName: envOrFail('NOTIFICATION_TX_EMAIL_FROM_NAME'),
    txEmailBccAddress: envOrFail('NOTIFICATION_TX_EMAIL_BCC_ADDRESS'),
    txEmailNoBcc: [
      Transaction.AccountRemoved,
      Transaction.FirstConnectionReady,
      Transaction.FirstExpected,
      Transaction.DonationReceived,
      Transaction.ConnectionRemoved,
      Transaction.ConnectionResumed,
      Transaction.ConnectionStopped,
      Transaction.ConnectionReady,
      Transaction.ReceiptExpected,
      Transaction.ReceiptDonation,
      Transaction.PendingFirstConnection,
      Transaction.AllowedMessageToUser,
      Transaction.AllowedMessageToUserSameDomain,
      Transaction.AllowedMessageToUserGatedUser,
      Transaction.ExpectedConsentRequested,
      Transaction.ReceiptExemptionRequested,
    ],
    alertAddress: {
      userJoined: envOrFail('NOTIFICATION_ALERT_USER_JOINED'),
      userOffboarded: envOrFail('NOTIFICATION_ALERT_USER_OFFBOARDED'),
      donationMade: envOrFail('NOTIFICATION_ALERT_DONATION_MADE'),
      userSignupAttempted: envOrFail(
        'NOTIFICATION_ALERT_USER_SIGNUP_ATTEMPTED',
      ),
      donationRequestDonated: envOrFail(
        'NOTIFICATION_ALERT_DONATION_REQUEST_DONATED',
      ),
    },
    expo: {
      accessToken: envOrFail('NOTIFICATION_EXPO_ACCESS_TOKEN'),
    },
  }),
);
