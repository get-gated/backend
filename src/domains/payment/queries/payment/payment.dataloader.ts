import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import PaymentEntity from '../../entities/payment.entity';
import { PaymentQuery } from './payment.query';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

export type IPaymentDataLoader = DataLoader<string, PaymentEntity>;

export function paymentDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, PaymentEntity> {
  return new DataLoader<string, PaymentEntity>(async (ids: string[]) => {
    const results: PaymentEntity[] = await queryBus.execute(
      new PaymentQuery([...ids]),
    );

    const map = mapFromArray(results, (item) => item.paymentId);

    return ids.map((id) => map[id]);
  });
}
