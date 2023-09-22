import { SyncType } from '@app/interfaces/service-provider/service-provider.enums';

export abstract class ConnectionSyncInterface {
  public readonly connectionSyncId: string;

  abstract readonly connectionId: string;

  public readonly targetDepth: Date;

  public readonly lastDepth?: Date;

  abstract readonly isFinished: boolean;

  public readonly type: SyncType;

  public readonly pageToken?: string | null;

  public readonly startedAt?: Date;

  public readonly finishedAt?: Date;

  public readonly isSyncing: boolean;

  constructor(props: ConnectionSyncInterface) {
    this.connectionSyncId = props.connectionSyncId;
    this.targetDepth = new Date(props.targetDepth);
    this.lastDepth = props.lastDepth && new Date(props.lastDepth);
    this.type = props.type;
    this.pageToken = props.pageToken;
    this.finishedAt = props.finishedAt && new Date(props.finishedAt);
    this.startedAt = props.startedAt && new Date(props.startedAt);
    this.isSyncing = props.isSyncing;
  }
}
