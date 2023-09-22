import { SyncType } from '@app/interfaces/service-provider/service-provider.enums';

export class ScheduleSyncCommand {
  constructor(
    public readonly connectionId: string,
    public readonly type: SyncType,
    public readonly targetDepth: Date,
  ) {}
}
