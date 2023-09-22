import { ClientConfig, Event } from '@app/modules/event-bus';

/* this is a special event that only gmail publishes to */
export const GMAIL_PUSH_NOTIFICATIONS_TOPIC_NAME = 'gmail-push-notifications';

// The project must match where oauth lives.
// Our prod oauth is in a different project than our app.
// This makes sure things are created in the right project for that environment
const clientConfig: ClientConfig = process.env
  .GOOGLE_GMAIL_PUSH_NOTIFICATION_PROJECT_ID
  ? { projectId: process.env.GOOGLE_GMAIL_PUSH_NOTIFICATION_PROJECT_ID }
  : {};

// Gmail API represents the historyId as a string, but we seem to get historyId
// as a number in push notifications.
interface PushNotification {
  emailAddress: string;
  historyId: string | number;
}

@Event(GMAIL_PUSH_NOTIFICATIONS_TOPIC_NAME, {}, clientConfig)
export class GmailPushNotificationEvent {
  public readonly emailAddress: string;

  public readonly historyId: string;

  constructor(message: PushNotification) {
    this.emailAddress = message.emailAddress;
    this.historyId = message.historyId.toString();
  }
}
