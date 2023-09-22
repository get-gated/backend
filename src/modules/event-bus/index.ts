export * from './event-bus.module';
export * from './event-bus.service';
export * from './event.decorator';
export {
  ClientConfig,
  PublishOptions,
  SubscriberOptions,
} from '@google-cloud/pubsub';

export interface IEventHandler<Event, Response = void> {
  handler: (event: Event) => Promise<Response>;
}
