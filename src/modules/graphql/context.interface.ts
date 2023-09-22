import { Response } from 'express';
import { RequestWithUser } from '@app/modules/auth/auth.guard';

import { IDataLoaders } from './dataloader/dataloader.service';

export interface IGraphqlContext {
  loaders: IDataLoaders;
  req: RequestWithUser;
  res: Response;
}
