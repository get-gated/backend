import { QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import {
  IMessageDataLoader,
  messageDataloader,
} from '../../../domains/service-provider/queries/message/message.dataloader';
import {
  challengeDataloader,
  IChallengeDataLoader,
} from '../../../domains/challenge/queries/challenge/challenge.dataloader';
import {
  challengeInteractionDataloader,
  IChallengeInteractionDataLoader,
} from '../../../domains/challenge/queries/challenge-interaction/challenge-interaction.dataloader';
import {
  connectionDataloader,
  IConnectionDataLoader,
} from '../../../domains/service-provider/queries/connection/connection.dataloader';
import {
  connectionLogDataloader,
  IConnectionLogDataLoader,
} from '../../../domains/service-provider/queries/connection-log/connection-log.dataloader';
import {
  decisionDataloader,
  IDecisionDataLoader,
} from '../../../domains/gatekeeper/queries/decision/decision.dataloader';
import {
  IUserDataLoader,
  userDataloader,
} from '../../../domains/user/queries/user/user.dataloader';
import {
  INonprofitDataLoader,
  nonprofitDataloader,
} from '../../../domains/challenge/queries/nonprofit/nonprofit.dataloader';
import {
  allowedThreadDataloader,
  IAllowedThreadDataLoader,
} from '../../../domains/gatekeeper/queries/allowed-thread/allowed-thread.dataloader';
import {
  ITrainingDataLoader,
  trainingDataloader,
} from '../../../domains/gatekeeper/queries/training/training.dataloader';
import {
  IPatternDataLoader,
  patternDataloader,
} from '../../../domains/gatekeeper/queries/pattern/pattern.dataloader';
import {
  INonprofitCategoryDataLoader,
  nonprofitCategoryDataloader,
} from '../../../domains/challenge/queries/nonprofit-category/nonprofit-category.dataloader';
import {
  challengeTemplateDataloader,
  IChallengeTemplateDataLoader,
} from '../../../domains/challenge/queries/challenge-template/challenge-template.dataloader';
import {
  IPaymentDataLoader,
  paymentDataloader,
} from '../../../domains/payment/queries/payment/payment.dataloader';
import {
  ITrainingByEmailDataLoader,
  trainingByEmailDataloader,
} from '../../../domains/gatekeeper/queries/training-by-email/training-by-email.dataloader';
import {
  IUserTaskDataLoader,
  userTaskDataloader,
} from '../../../domains/user/queries/task/task.dataloader';

export interface IDataLoaders {
  connection: IConnectionDataLoader;
  connectionLog: IConnectionLogDataLoader;
  message: IMessageDataLoader;
  challenge: IChallengeDataLoader;
  challengeInteraction: IChallengeInteractionDataLoader;
  challengeTemplate: IChallengeTemplateDataLoader;
  nonprofit: INonprofitDataLoader;
  nonprofitCategory: INonprofitCategoryDataLoader;
  decision: IDecisionDataLoader;
  user: IUserDataLoader;
  userTask: IUserTaskDataLoader;
  allowedThread: IAllowedThreadDataLoader;
  training: ITrainingDataLoader;
  pattern: IPatternDataLoader;
  payment: IPaymentDataLoader;
  trainingByEmail: ITrainingByEmailDataLoader;
}

@Injectable()
export class DataloaderService {
  constructor(private queryBus: QueryBus) {}

  private mapFromArray<T>(
    array: T[],
    keyStrategy: (v: T) => string | number,
  ): Record<string | number, T> {
    const map: Record<string | number, T> = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const item of array) {
      map[keyStrategy(item)] = item;
    }

    return map;
  }

  public createLoaders(): IDataLoaders {
    return {
      connection: connectionDataloader(this.queryBus, this.mapFromArray),
      connectionLog: connectionLogDataloader(this.queryBus, this.mapFromArray),
      message: messageDataloader(this.queryBus, this.mapFromArray),
      challenge: challengeDataloader(this.queryBus, this.mapFromArray),
      challengeInteraction: challengeInteractionDataloader(
        this.queryBus,
        this.mapFromArray,
      ),
      challengeTemplate: challengeTemplateDataloader(
        this.queryBus,
        this.mapFromArray,
      ),
      nonprofit: nonprofitDataloader(this.queryBus, this.mapFromArray),
      nonprofitCategory: nonprofitCategoryDataloader(
        this.queryBus,
        this.mapFromArray,
      ),
      decision: decisionDataloader(this.queryBus, this.mapFromArray),
      user: userDataloader(this.queryBus, this.mapFromArray),
      userTask: userTaskDataloader(this.queryBus, this.mapFromArray),
      allowedThread: allowedThreadDataloader(this.queryBus, this.mapFromArray),
      training: trainingDataloader(this.queryBus, this.mapFromArray),
      pattern: patternDataloader(this.queryBus, this.mapFromArray),
      payment: paymentDataloader(this.queryBus, this.mapFromArray),
      trainingByEmail: trainingByEmailDataloader(this.queryBus),
    };
  }
}
