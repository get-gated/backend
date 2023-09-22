/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import Expo, { ExpoPushMessage, ExpoPushReceipt } from 'expo-server-sdk';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { LoggerService } from '@app/modules/logger';

import NotificationConfig from '../../notification.config';

import {
  ProcessReceiptResponse,
  PushAdapter,
  PushProps,
  PushResponse,
} from './push.adapter';

export class PushService implements PushAdapter {
  private expo: Expo;

  constructor(
    @Inject(NotificationConfig.KEY)
    private notificationConfig: ConfigType<typeof NotificationConfig>,
    private log: LoggerService,
  ) {
    this.expo = new Expo({
      accessToken: this.notificationConfig.expo.accessToken,
    });
  }

  public async push(props: PushProps): Promise<PushResponse> {
    const { body, badge, data } = props;
    const messages: ExpoPushMessage[] = [];
    props.tokens.forEach((to) => {
      messages.push({
        body,
        badge,
        data,
        to,
      });
    });

    const response: PushResponse = [];

    const chunks = this.expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);

        ticketChunk.forEach((ticket, i) => {
          response.push({
            token: chunk[i].to as string,
            error:
              ticket.status === 'error' ? ticket.details?.error : undefined,
            body,
            badge,
            data,
            receiptId: ticket.status === 'ok' ? ticket.id : undefined,
          });
        });
      } catch (error) {
        this.log.error(
          { error, chunk },
          'Error processing chunk of push notifications',
        );
      }
    }

    return response;
  }

  public async validateToken(token: string): Promise<boolean> {
    return Expo.isExpoPushToken(token);
  }

  public async processReceipts(
    receiptIds: string[],
  ): Promise<ProcessReceiptResponse> {
    const receiptIdChunks =
      this.expo.chunkPushNotificationReceiptIds(receiptIds);

    const response: ProcessReceiptResponse = [];

    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await this.expo.getPushNotificationReceiptsAsync(
          chunk,
        );

        for (const receiptId in receipts) {
          const receipt: ExpoPushReceipt = receipts[receiptId];
          response.push({
            receiptId,
            error:
              receipt.status === 'error' ? receipt.details?.error : undefined,
          });
        }
      } catch (error) {
        this.log.error(
          { error, chunk },
          'Error getting push receipts for chunk',
        );
      }
    }

    return response;
  }
}
