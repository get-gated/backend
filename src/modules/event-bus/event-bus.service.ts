import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdapterService } from '@app/modules/event-bus/adapter/adapter.service';

import { EventNameToken, IEventMetadata } from './event.decorator';

@Injectable()
export class EventBusService {
  constructor(private reflector: Reflector, private eventBus: AdapterService) {}

  public async publish<Event>(event: Event): Promise<void> {
    const eventMetadata: IEventMetadata = this.reflector.get(
      EventNameToken,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event as any).constructor,
    );
    await this.eventBus.adapter.publish(eventMetadata.eventName, event);
  }

  public async close(): Promise<void> {
    return this.eventBus.adapter.close();
  }

  public getTopicName(topicName: string): string {
    return this.eventBus.adapter.getTopicName(topicName);
  }
}
