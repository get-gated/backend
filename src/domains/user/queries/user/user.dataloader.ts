import * as DataLoader from 'dataloader';
import { QueryBus } from '@nestjs/cqrs';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';

import UserEntity from '../../entities/user.entity';

import { UserQuery } from './user.query';

export type IUserDataLoader = DataLoader<string, UserEntity>;

export function userDataloader(
  queryBus: QueryBus,
  mapFromArray: DataloaderService['mapFromArray'],
): DataLoader<string, UserEntity> {
  return new DataLoader<string, UserEntity>(async (ids: string[]) => {
    const data: UserEntity[] = await queryBus.execute(new UserQuery([...ids]));

    const map = mapFromArray(data, (item) => item.userId);

    return ids.map((id) => map[id]);
  });
}
