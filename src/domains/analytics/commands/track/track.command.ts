import { AnalyticEvent } from '../../analytics.enums';
import {
  TContext,
  TTrackProperties,
} from '../../services/adapters/adapter.interface';

export class TrackCommand {
  constructor(
    public readonly eventName: AnalyticEvent,
    public readonly userId: string | undefined,
    public readonly properties: TTrackProperties,
    public readonly context?: TContext,
  ) {}
}
