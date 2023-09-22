import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { LoggerService } from '@app/modules/logger';
import { AsyncContextService } from '@app/modules/async-context';

import { AnalyticEvent } from '../../../analytics.enums';
import AnalyticsConfig from '../../../analytics.config';
import {
  AnalyticsAdapterInterface,
  TContext,
  TIdentifyTraits,
  TTrackProperties,
} from '../adapter.interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Analytics = require('analytics-node');

interface TrackPayload {
  userId?: string;
  event: AnalyticEvent;
  properties: TTrackProperties;
  context?: TContext;
  anonymousId?: string;
}

@Injectable()
export class SegmentService implements AnalyticsAdapterInterface {
  private analytics: typeof Analytics;

  constructor(
    @Inject(AnalyticsConfig.KEY)
    private config: ConfigType<typeof AnalyticsConfig>,
    private log: LoggerService,
    private ac: AsyncContextService,
  ) {
    this.analytics = new Analytics(this.config.segment.writeKey);
  }

  public async track(
    // eslint-disable-next-line default-param-last
    userId: string | void = this.ac.get('userId'), // if not provided, check ac
    eventName: AnalyticEvent,
    properties: TTrackProperties,
    context?: TContext,
  ): Promise<void> {
    let anonymousId: string = uuid();
    try {
      this.log.debug(
        { userId, eventName, properties, context },
        'Analytics tracking of event running',
      );

      const payload: TrackPayload = {
        event: eventName,
        properties,
        context,
      };

      if (userId) {
        payload.userId = userId;
      } else {
        anonymousId = this.ac.get('anonymousId') ?? anonymousId; // use anonymousId from ac if available, otherwise generator random per Segments docs
        payload.anonymousId = anonymousId;
      }

      await this.analytics.track(payload);
    } catch (error) {
      this.log.error(
        { error, userId, anonymousId, eventName, properties, context },
        'Analytics tracking of event failed',
      );
      throw error;
    }
  }

  public async identify(
    userId: string,
    traits: TIdentifyTraits,
    context?: TContext,
  ): Promise<void> {
    try {
      this.log.debug({ userId, traits, context }, 'Analytics identity running');
      await this.analytics.identify({
        userId,
        traits,
        context,
      });
    } catch (error) {
      this.log.error(
        { error, userId, traits, context },
        'Analytics identity failed',
      );
      throw error;
    }
  }
}
