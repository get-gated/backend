import { MikroORM } from '@mikro-orm/core';
import UserEntity from '../src/domains/user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import ConnectionEntity from '../src/domains/service-provider/entities/connection.entity';
import {
  Provider,
  Status,
} from '@app/interfaces/service-provider/service-provider.enums';
import ChallengeUserSettingEntity from '../src/domains/challenge/entities/user-setting.entity';
import NonprofitEntity from '../src/domains/challenge/entities/nonprofit.entity';
import NonprofitCategoryEntity from '../src/domains/challenge/entities/nonprofit-category.entity';
import ChallengeConnectionSettingEntity from '../src/domains/challenge/entities/connection-setting.entity';
import { ChallengeMode } from '@app/interfaces/challenge/challenge.enums';
import ChallengeTemplateEntity from '../src/domains/challenge/entities/template.entity';
import NotificationUserSettings from '../src/domains/notification/entities/user-settings.entity';
import * as faker from 'faker';

export default async function seed(orm: MikroORM) {
  const now = new Date();
  const user: Partial<UserEntity> = {
    userId: uuidv4(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    joinedAt: now,
  };

  const expiration = new Date();
  expiration.setDate(now.getMonth() + 1);

  const connection: Partial<ConnectionEntity> = {
    connectionId: uuidv4(),
    userId: user.userId,
    provider: Provider.Google,
    emailAddress: faker.internet.email(),
    externalAccountId: faker.random.alphaNumeric(),
    externalAccessToken: faker.random.alphaNumeric(),
    providerToken: faker.random.alphaNumeric(),
    providerUserId: faker.random.alphaNumeric(),
    createdAt: now,
    status: Status.Running,
    isActivated: true,
  };

  const nonprofitCategory: Partial<NonprofitCategoryEntity> = {
    nonprofitCategoryId: uuidv4(),
    name: 'For Good',
    description: 'Non profits that do good things',
  };

  const nonprofit: Partial<NonprofitEntity> = {
    nonprofitId: uuidv4(),
    name: faker.company.companyName(),
    description: faker.company.catchPhrase(),
    isDefault: true,
  };

  const challengeUserSetting: Partial<ChallengeUserSettingEntity> = {
    challengeUserSettingId: uuidv4(),
    userId: user.userId,
    signature: user.firstName,
    minimumDonation: 2,
  };

  const challengeConnectionSetting: Partial<ChallengeConnectionSettingEntity> =
    {
      challengeConnectionSettingId: uuidv4(),
      connectionId: connection.connectionId,
      userId: user.userId,
      mode: ChallengeMode.Send,
    };

  const template: Partial<ChallengeTemplateEntity> = {
    challengeTemplateId: uuidv4(),
    updatedAt: new Date(),
    createdAt: new Date(),
    body: '',
    donateBlock: '',
    expectedBlock: '',
    greetingBlock: '',
    signatureBlock: '',
    leadBlock: '',
    isEnabled: true,
  };

  const notificationUserSettings: Partial<NotificationUserSettings> = {
    userId: user.userId,
    email: connection.emailAddress,
    userSettingId: uuidv4(),
    updatedAt: new Date(),
  };

  const seedUser = orm.em.create(UserEntity, user);
  const seedConnection = orm.em.create(ConnectionEntity, connection);
  const seedNonprofitCategory = orm.em.create(
    NonprofitCategoryEntity,
    nonprofitCategory,
  );
  const seedNonprofit = orm.em.create(NonprofitEntity, {
    ...nonprofit,
    category: orm.em.getReference(
      NonprofitCategoryEntity,
      nonprofitCategory.nonprofitCategoryId,
    ),
  });

  const seedChallengeUserSetting = orm.em.create(ChallengeUserSettingEntity, {
    ...challengeUserSetting,
    nonprofit: orm.em.getReference(NonprofitEntity, nonprofit.nonprofitId),
  });

  const seedChallengeConnectionSetting = orm.em.create(
    ChallengeConnectionSettingEntity,
    challengeConnectionSetting,
  );

  const seedTemplate = orm.em.create(ChallengeTemplateEntity, template);

  const seedNotificationUserSetting = orm.em.create(
    NotificationUserSettings,
    notificationUserSettings,
  );

  await orm.em.persistAndFlush([
    seedUser,
    seedConnection,
    seedNonprofitCategory,
    seedNonprofit,
    seedChallengeUserSetting,
    seedChallengeConnectionSetting,
    seedTemplate,
    seedNotificationUserSetting,
  ]);

  return {
    seedUser,
    seedConnection,
    seedNonprofitCategory,
    seedNonprofit,
    seedChallengeUserSetting,
    seedChallengeConnectionSetting,
    seedTemplate,
    seedNotificationUserSetting,
  };
}
