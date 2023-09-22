import { SyncType } from '@app/interfaces/service-provider/service-provider.enums';
import { Event } from '@app/modules/event-bus';

@Event('SyncScheduled')
export class SyncScheduledEvent {
  public readonly connectionSyncId: string;

  public readonly connectionId: string;

  public readonly type: SyncType;

  constructor(message: SyncScheduledEvent) {
    this.connectionSyncId = message.connectionSyncId;
    this.connectionId = message.connectionId;
    this.type = message.type;
  }
}
