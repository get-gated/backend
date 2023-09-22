/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEventHandler, IEventMetadata } from '@app/modules/event-bus';
import { SubscriberOptions } from '@google-cloud/pubsub';

export interface EventConstructor {
  new (props: any): any;
}

export interface ISubscriber {
  subscriberId: string;
  Event: EventConstructor;
  eventMetadata: IEventMetadata;
  handler: IEventHandler<any>;
  options?: SubscriberOptions;
}

export interface IEventBusAdapter {
  init: () => Promise<void>;
  close: () => Promise<void>;
  getTopicName: (name: string) => string;
  registerEvents: (events: IEventMetadata[]) => Promise<void>;
  registerSubscribers: (subscribers: ISubscriber[]) => Promise<void>;
  publish: (topicName: string, messagePayload: any) => Promise<string>;
}
