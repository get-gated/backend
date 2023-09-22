import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import HistoryMessageEntity from '../../entities/history-message.entity';

import { MessageQuery } from './message.query';

export type IMessageDataLoader = DataLoader<string, HistoryMessageEntity>;

export function messageDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, HistoryMessageEntity> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new DataLoader<string, HistoryMessageEntity>(
    async (messageIds: readonly string[]) => {
      const messages: HistoryMessageEntity[] = await queryBus.execute(
        new MessageQuery([...messageIds]),
      );

      const messageMap = mapFromArray(messages, (message) => message.messageId);

      return messageIds
        .map((id) => messageMap[id])
        .filter(Boolean) as HistoryMessageEntity[];
    },
  );
}
