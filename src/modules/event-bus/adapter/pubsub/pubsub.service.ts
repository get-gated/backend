import { Inject, Injectable } from '@nestjs/common';
import {
  ClientConfig,
  PublishOptions,
  PubSub,
  SubscriberOptions,
  Subscription,
  Topic,
} from '@google-cloud/pubsub';
import { EntityManager } from '@mikro-orm/postgresql';
import { google } from '@google-cloud/pubsub/build/protos/protos';
import { ConfigType } from '@nestjs/config';
import {
  ROOT_CONTEXT,
  Span,
  SpanContext,
  SpanStatusCode,
  trace,
} from '@opentelemetry/api';
import { MikroOrmStorage } from '@app/modules/db';
import { LoggerService } from '@app/modules/logger';
import { AsyncContextService } from '@app/modules/async-context/async-context.service';
import { IEventMetadata } from '@app/modules/event-bus';
import { HealthService } from '@app/modules/health';

import EventBusConfig from '../../event-bus.config';
import {
  EventConstructor,
  IEventBusAdapter,
  ISubscriber,
} from '../adapter.interface';

import PubsubMessageBase = google.pubsub.v1.PubsubMessage;

const tracer = trace.getTracer('default');

interface KeyVal<T> {
  [key: string]: T;
}

interface Instance {
  pubSub: PubSub;
  topics: KeyVal<Topic>;
  subscription?: Subscription;
}

interface Cache {
  [key: string]: Instance;
}

interface PubsubMessage extends PubsubMessageBase {
  ack: () => void;
  nack: () => void;
}

const SHARED_CACHE_NAME = '__shared__';

@Injectable()
export default class PubsubService implements IEventBusAdapter {
  constructor(
    private log: LoggerService,
    private em: EntityManager,
    @Inject(EventBusConfig.KEY)
    private config: ConfigType<typeof EventBusConfig>,
    private ac: AsyncContextService,
    private healthService: HealthService,
  ) {
    this.getCache(SHARED_CACHE_NAME);
  }

  private cache: Cache = {};

  private getCache(name: string, config: ClientConfig = {}): Instance {
    const existing = this.cache[name];
    if (existing) return existing;

    const pubSub = new PubSub(config);
    this.cache[name] = { pubSub, topics: {} };

    return this.cache[name];
  }

  private setAsyncContextFromMessage(
    message: PubsubMessage,
  ): void | Record<string, unknown> {
    try {
      const json = message.attributes.asyncContext || '{}';
      this.log.debug({ json }, `Parsing message attribute json`);
      const context = JSON.parse(json);
      this.ac.register(context);
    } catch (error) {
      this.log.error({ error }, 'Error parsing JSON');
      return {};
    }
  }

  private getAsyncContextAttributes(): { asyncContext: string } {
    const asyncContext = this.ac.getAll();
    return { asyncContext: JSON.stringify(asyncContext) };
  }

  private async getSubscription(
    topicName: string,
    subscriptionName: string,
    options?: SubscriberOptions,
    clientConfig?: ClientConfig,
  ): Promise<Subscription> {
    try {
      const instance = this.getCache(subscriptionName, clientConfig);

      const topic = await this.getTopic(topicName, subscriptionName);

      const existing = instance.subscription;
      if (existing) {
        this.log.debug(
          { subscriptionName, topicName },
          'returning subscription from cache',
        );
        return existing;
      }

      const [subscription] = await instance.pubSub
        .subscription(subscriptionName, {
          topic,
          enableOpenTelemetryTracing: true,
          ...options,
          // streamingOptions: { maxStreams: 1 },
        })
        .get({ autoCreate: true });
      await subscription.setMetadata({
        retryPolicy: {
          maximumBackoff: { seconds: this.config.maxBackoffSeconds },
          minimumBackoff: { seconds: this.config.minBackoffSeconds },
        },
        deadLetterPolicy: {
          maxDeliveryAttempts: this.config.maxDeliveryAttempts,
          deadLetterTopic: this.getCache(SHARED_CACHE_NAME).pubSub.topic(
            this.getTopicName(this.config.deadLetterTopicName),
          ).name,
        },
      });
      instance.subscription = subscription;
      return subscription;
    } catch (error) {
      this.log.error({ error, subscriptionName }, 'Error getting subscription');
      throw error;
    }
  }

  public getTopicName(topicName: string): string {
    const prefix = this.config.subscriptionPrefix
      ? `${this.config.subscriptionPrefix}.`
      : '';
    return `${prefix}${topicName}`;
  }

  private async getTopic(
    topicName: string,
    cacheName: string,
    options?: PublishOptions,
    clientConfig?: ClientConfig,
  ): Promise<Topic> {
    const formattedTopicName = this.getTopicName(topicName);
    this.log.debug({ topicName }, 'Getting Topic');

    const instance = this.getCache(cacheName, clientConfig);
    const existing = instance.topics[formattedTopicName];

    if (existing) {
      this.log.debug({ topicName, cacheName }, 'Using existing topic in cache');
      return existing;
    }

    try {
      const [topic] = await instance.pubSub
        .topic(formattedTopicName, {
          ...options,
          enableOpenTelemetryTracing: true,
        })
        .get({ autoCreate: true });
      instance.topics[formattedTopicName] = topic;
      return topic;
    } catch (error) {
      this.log.error(
        { error, topicName: formattedTopicName },
        'Error getting topic',
      );
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public async publish(
    topicName: string,
    messagePayload: any,
  ): Promise<string> {
    const topic = await this.getTopic(topicName, SHARED_CACHE_NAME);

    const attributes = this.getAsyncContextAttributes();
    const messageId = await topic.publishMessage({
      json: messagePayload,
      attributes,
    });
    return messageId[0];
  }

  private getSubscriptionName(eventName: string, subscriberId: string): string {
    const prefix = this.config.subscriptionPrefix
      ? `${this.config.subscriptionPrefix}.`
      : '';
    return `${prefix}${eventName}.${subscriberId}`;
  }

  public async close(): Promise<void> {
    const instanceNames = Object.keys(this.cache);
    for (let i = 0; i < instanceNames.length; i++) {
      const instance = this.cache[instanceNames[i]];
      const topicNames = Object.keys(instance.topics);
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        topicNames.map((topicName) => instance.topics[topicName].flush()),
      );
      // eslint-disable-next-line no-await-in-loop
      await instance.pubSub.close();
    }
  }

  public async stopSubscribers(): Promise<void> {
    const instanceNames = Object.keys(this.cache);
    for (let i = 0; i < instanceNames.length; i++) {
      const pubSubCache = this.cache[instanceNames[i]];
      // eslint-disable-next-line no-await-in-loop
      await pubSubCache.subscription?.close();
    }
  }

  public async init(): Promise<void> {
    const deadLetterTopic = this.config.deadLetterTopicName;
    if (deadLetterTopic) {
      await this.getTopic(deadLetterTopic, SHARED_CACHE_NAME);
    }
  }

  private nack(message: PubsubMessage): void {
    if (this.config.disableDeliveryRetry) {
      this.log.info(
        { messageId: message.messageId },
        'Delivery retry disabled, acking instead of nacking.',
      );
      return message.ack();
    }

    message.nack();
  }

  private getSpanContext(message: PubsubMessage): SpanContext | undefined {
    try {
      return JSON.parse(message.attributes.googclient_OpenTelemetrySpanContext);
    } catch (error) {
      return undefined;
    }
  }

  private async subscribe(subscriber: ISubscriber): Promise<void> {
    const { eventMetadata, subscriberId, Event, handler, options } = subscriber;
    const { eventName } = eventMetadata;
    this.log.info(
      {
        eventName,
        subscriberId,
      },
      'Creating subscription to event',
    );

    const subscriptionName = this.getSubscriptionName(eventName, subscriberId);
    const subscription = await this.getSubscription(
      eventName,
      subscriptionName,
      options,
      eventMetadata.clientConfig,
    );

    const messageHandler = (message: PubsubMessage): void => {
      const eventBus = {
        messageId: message.messageId,
        publishTime: message.publishTime,
        eventName,
        subscriberId,
      };

      this.log.debug({ ...eventBus }, 'Received event bus message');

      this.setAsyncContextFromMessage(message);

      let event: EventConstructor;
      try {
        const eventData = JSON.parse(message.data.toString());
        event = new Event(eventData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (event as any).metadata = {
          attributes: message.attributes,
          messageId: message.messageId,
        };
      } catch (error) {
        this.log.error({ error }, 'Error rehydrating event');
        return this.nack(message);
      }

      const spanContext = this.getSpanContext(message);

      const callback = async (span: Span): Promise<void> => {
        try {
          // todo: should register this as middleware when importing the module so that we don't have to know about mikro-orm
          await MikroOrmStorage.run(this.em.fork(true, true), async () => {
            this.log.debug({ eventBus }, 'Passing to event handler');
            try {
              if (this.healthService.isShuttingDown()) {
                this.log.info(
                  { event },
                  `Server is shutting down. Ignoring event for ${subscriptionName}.`,
                );
                return;
              }
              const beacon = this.healthService.createBeacon();
              try {
                await handler.handler(event);
                this.log.debug('Message handler successful. Acking.');
                message.ack();
              } finally {
                await beacon.die();
              }
            } catch (error) {
              this.log.error({ error }, 'Message handler failed. Nacking.');
              this.nack(message);
            }
          });
          span?.setStatus({ code: SpanStatusCode.OK });
          span?.end();
        } catch (err) {
          span?.setStatus({
            code: SpanStatusCode.ERROR,
            message: err instanceof Error ? err.message : undefined,
          });
          span?.end();
          throw err;
        }
      };

      if (spanContext) {
        tracer.startActiveSpan(
          `event-subscriber-${subscriptionName}`,
          {},
          trace.setSpanContext(ROOT_CONTEXT, spanContext),
          callback,
        );
      } else {
        tracer.startActiveSpan(
          `event-subscriber-${subscriptionName}`,
          {},
          callback,
        );
      }
    };

    subscription.on('message', messageHandler);
    subscription.on('error', (error) => {
      this.log.error({ error }, 'PubSub subscription error');
    });
  }

  public async registerSubscribers(subscribers: ISubscriber[]): Promise<void> {
    for (let i = 0; i < subscribers.length; i++) {
      const subscriber = subscribers[i];
      // eslint-disable-next-line no-await-in-loop
      await this.subscribe(subscriber);
    }
  }

  public async registerEvents(events: IEventMetadata[]): Promise<void> {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      const cacheName = event.clientConfig
        ? event.eventName
        : SHARED_CACHE_NAME;

      // eslint-disable-next-line no-await-in-loop
      await this.getTopic(
        event.eventName,
        cacheName,
        event.options,
        event.clientConfig,
      );
    }
  }
}
