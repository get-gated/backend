import { AnalyticEvent } from '../../analytics.enums';

export interface KeyVal {
  [key: string]: unknown;
}
export type TIdentifyTraits = KeyVal;
export type TTrackProperties = KeyVal;
export type TContext = KeyVal;

export interface AnalyticsAdapterInterface {
  identify?(
    userId: string | void,
    traits: TIdentifyTraits,
    context?: TContext,
  ): Promise<void>;
  track(
    userId: string | void,
    eventName: AnalyticEvent,
    properties: TTrackProperties,
    context?: TContext,
  ): Promise<void>;
}
export enum AnalyticAdapter {
  Segment = 'segment',
}
export type AnalyticsAdapterCollectionInterface = Record<
  AnalyticAdapter,
  AnalyticsAdapterInterface
>;
