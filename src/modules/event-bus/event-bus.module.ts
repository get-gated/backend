import {
  BeforeApplicationShutdown,
  Global,
  Inject,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DiscoveryService, ModuleRef, Reflector } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AdapterService } from '@app/modules/event-bus/adapter/adapter.service';
import { ISubscriber } from '@app/modules/event-bus/adapter/adapter.interface';
import PubsubService from '@app/modules/event-bus/adapter/pubsub/pubsub.service';
import { LoggerService } from '@app/modules/logger';

import AppConfig, { AppMode } from '../../app.config';

import EventBusConfig from './event-bus.config';
import {
  EventHandlerToken,
  EventNameToken,
  IEventHandlerMetadata,
  IEventMetadata,
} from './event.decorator';
import { EventBusService } from './event-bus.service';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(EventBusConfig),
    ConfigModule.forFeature(AppConfig),
  ],
  providers: [
    EventBusService,
    DiscoveryService,
    MetadataScanner,
    AdapterService,
    PubsubService,
  ],
  exports: [EventBusService],
})
export class EventBusModule
  implements
    OnApplicationBootstrap,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  constructor(
    private readonly discovery: DiscoveryService,
    private reflector: Reflector,
    private readonly moduleRef: ModuleRef,
    private eventBus: AdapterService,
    private log: LoggerService,
    @Inject(AppConfig.KEY) private appConfig: ConfigType<typeof AppConfig>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.eventBus.adapter.init();

    if (
      this.appConfig.mode === AppMode.Job ||
      this.appConfig.mode === AppMode.API
    )
      return; // don't register subscribers in job mode
    const providers = this.discovery.getProviders();
    const events: IEventMetadata[] = [];
    let handlers: IEventHandlerMetadata[] = [];

    providers.forEach((wrapper) => {
      const target =
        !wrapper.metatype || wrapper.inject
          ? wrapper.instance?.constructor
          : wrapper.metatype;

      if (!target) return;

      const eventMetadata: IEventMetadata = this.reflector.get(
        EventNameToken,
        target,
      );
      if (eventMetadata) {
        this.log.debug(
          {
            ...eventMetadata,
          },
          'Found Event',
        );
        events.push(eventMetadata);
      }

      const handlerMetadata: IEventHandlerMetadata = this.reflector.get(
        EventHandlerToken,
        target,
      );
      if (handlerMetadata) {
        this.log.debug(
          {
            ...handlerMetadata,
          },
          'Found Event Handler',
        );
        handlers.push(handlerMetadata);
      }
    });

    // register events
    this.log.info('Registering events');
    await this.eventBus.adapter.registerEvents(events);

    const subscriberIncludes = this.appConfig.subscribers?.include;
    const subscriberExcludes = this.appConfig.subscribers?.exclude;
    if (subscriberIncludes) {
      handlers = handlers.filter((meta) =>
        subscriberIncludes.includes(meta.target.name),
      );
    }
    if (subscriberExcludes) {
      handlers = handlers.filter(
        (meta) => !subscriberExcludes.includes(meta.target.name),
      );
    }

    // register subscribers
    this.log.info('Registering subscriptions');
    const subscribers: ISubscriber[] = handlers.map((handler) => {
      const handlerInstance = this.moduleRef.get(handler.target, {
        strict: false,
      });

      return {
        subscriberId: handler.subscriberId,
        Event: handler.eventConstructor,
        eventMetadata: handler.eventMetadata,
        handler: handlerInstance,
        options: handler.options,
      };
    });

    await this.eventBus.adapter.registerSubscribers(subscribers);
  }

  async beforeApplicationShutdown(): Promise<void> {
    this.log.info('Stopping EventBus subscribers in prep for shutdown');
    await this.eventBus.adapter.stopSubscribers();
    this.log.info('EventBus subscribers successfully stopped');
  }

  async onApplicationShutdown(): Promise<void> {
    this.log.info('Shutting down EventBus');
    await this.eventBus.adapter.close();
    this.log.info('EventBus successfully shutdown');
  }
}
