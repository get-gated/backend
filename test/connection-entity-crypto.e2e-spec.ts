import { appClose, appInit } from './app-init-close';
import { MikroORM } from '@mikro-orm/core';
import seedData from './seed-data';
import ConnectionEntity from '../src/domains/service-provider/entities/connection.entity';
import {
  Provider,
  Status,
} from '@app/interfaces/service-provider/service-provider.enums';

describe('Connection Entity Crypto (E2E)', () => {
  let app, orm: MikroORM, user;

  beforeAll(async () => {
    app = await appInit();
    orm = app.get(MikroORM);
    const seed = await seedData(orm);
    user = seed.seedUser;
  });
  afterAll(async () => await appClose(app));

  it('should encrypt and decrypt sensitive fields', async () => {
    const newEntity = new ConnectionEntity({
      userId: user.userId,
      emailAddress: 'joe@blow.com',
      externalAccountId: 'nylas account',
      providerToken: 'secret refresh',
      externalAccessToken: 'secret nylas',
      providerUserId: 'kfjdalkfjs',
      status: Status.Running,
      provider: Provider.Google,
    });

    await orm.em.persistAndFlush(newEntity);

    //todo: determine if persisted value is encrypted/opaque

    const readEntity = await orm.em.findOne(
      ConnectionEntity,
      newEntity.connectionId,
    );

    expect(readEntity.externalAccessToken).toEqual(
      newEntity.externalAccessToken,
    );
  });
});
