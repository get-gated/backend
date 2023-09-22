/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetMetadata } from '@nestjs/common';
import {
  ClientConfig,
  PublishOptions,
  SubscriberOptions,
} from '@google-cloud/pubsub';

export const EventNameToken = 'event_name';
export const EventHandlerToken = 'event_handler';

export interface IEventMetadata {
  eventName: string;
  options?: PublishOptions;
  clientConfig?: ClientConfig;
}

export interface IEventHandlerMetadata {
  subscriberId: string;
  target: any;
  eventMetadata: IEventMetadata;
  eventConstructor: any;
  options?: SubscriberOptions;
}

export const Event = (
  event: string,
  options?: PublishOptions,
  clientConfig?: ClientConfig,
): ReturnType<typeof SetMetadata> =>
  SetMetadata<string, IEventMetadata>(EventNameToken, {
    eventName: event,
    options,
    clientConfig,
  });

export const EventHandler = (
  /* Event class */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  event: any,
  subscriberId: string,
  options?: SubscriberOptions,
): ((target: any) => void) => {
  const eventMetadata: IEventMetadata = Reflect.getMetadata(
    EventNameToken,
    event,
  );
  return (target: any) => {
    SetMetadata<string, IEventHandlerMetadata>(EventHandlerToken, {
      subscriberId,
      target,
      eventMetadata,
      eventConstructor: event,
      options,
    })(target);
  };
};
