import { registerAs } from '@nestjs/config';

interface eventBusConfig {
  maxBackoffSeconds: number; // max 600
  minBackoffSeconds: number; // min 1
  maxDeliveryAttempts: number; // equal or greater than 5
  deadLetterTopicName: string;
  disableDeliveryRetry: boolean; // used for testing and dev environments
  subscriptionPrefix: string; // used for namespacing subscriptions when multiple apps are sharing a single pubsub service. Applies to test and dev environments
}

export default registerAs(
  'eventBus',
  (): eventBusConfig => ({
    maxBackoffSeconds: Number(process.env.PUBSUB_MAX_BACKOFF_SECS),
    minBackoffSeconds: Number(process.env.PUBSUB_MIN_BACKOFF_SECS),
    maxDeliveryAttempts: Number(process.env.PUBSUB_MAX_DELIVERY_ATTEMPTS),
    deadLetterTopicName: process.env.PUBSUB_DEAD_LETTER_TOPIC_NAME ?? '',
    disableDeliveryRetry:
      process.env.EVENT_BUS_DISABLE_DELIVERY_RETRY === 'true',
    subscriptionPrefix: process.env.EVENT_BUS_SUBSCRIPTION_PREFIX ?? '',
  }),
);
