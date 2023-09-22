import { EntityRepository } from '@mikro-orm/postgresql';
import { QueryOrder, Repository } from '@mikro-orm/core';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';

import TrainingEntity from '../training.entity';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Repository(TrainingEntity)
export default class TrainingRepository extends EntityRepository<TrainingEntity> {
  public async receivedEmailFromUnknownSender(
    userId: string,
    username: string,
    domain: string,
  ): Promise<TrainingEntity> {
    const newTraining = new TrainingEntity({
      userId,
      username,
      domain,
      rule: Rule.Gate,
      origin: TrainingOrigin.ReceivedEmail,
    });
    this.persist(newTraining);
    return newTraining;
  }

  public async findContactTraining(
    fromDomain: string,
    fromUsername: string,
    userId: string,
  ): Promise<Pick<TrainingEntity, 'rule' | 'trainingId'> | null> {
    const training = await this.findOne(
      { userId, username: fromUsername, domain: fromDomain },
      {
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );

    if (!training) {
      return null;
    }
    const { rule, trainingId } = training;
    return {
      trainingId,
      rule,
    };
  }

  public async findDomainTraining(
    fromDomain: string,
    userId: string,
  ): Promise<Pick<TrainingEntity, 'rule' | 'trainingId'> | null> {
    const training = await this.findOne(
      { userId, username: null, domain: fromDomain },
      {
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );

    if (!training) {
      return null;
    }
    const { rule, trainingId } = training;
    return {
      trainingId,
      rule,
    };
  }

  public async retrain(
    trainingId: string,
    rule: Rule,
    isAdmin = false,
  ): Promise<TrainingEntity> {
    const training = await this.findOneOrFail({ trainingId });

    const newTraining = new TrainingEntity({
      ...training,
      rule,
      origin: isAdmin ? TrainingOrigin.AdminApp : TrainingOrigin.UserApp,
    });
    this.persist(newTraining);
    return newTraining;
  }

  public async getTrainedAddresses(userId: string): Promise<TrainingEntity[]> {
    const trainings = await this.find(
      { userId, username: { $not: null } },
      {
        fields: [
          'CONCAT(username, "@", domain) AS email',
          'id',
          'createdAt',
          'origin',
        ],
        groupBy: ['username', 'domain'],
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
    return trainings || [];
  }

  public async getTrainedDomains(userId: string): Promise<TrainingEntity[]> {
    const trainings = await this.find(
      { userId, username: null },
      {
        fields: ['domain', 'id', 'createdAt', 'origin'],
        groupBy: ['domain'],
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
    return trainings || [];
  }
}
