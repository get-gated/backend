import * as request from 'supertest';
import { btoa } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import ConnectionEntity from '../src/domains/service-provider/entities/connection.entity';
import ChallengeConnectionSettingEntity from '../src/domains/challenge/entities/connection-setting.entity';
import seedData from './seed-data';
import { appInit, appClose } from './app-init-close';
import { MikroORM } from '@mikro-orm/core';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nock = require('nock');

describe.skip('Add Google Connection To User (e2e)', () => {
  let app, orm, user, expected;

  beforeAll(async () => {
    app = await appInit();
    orm = app.get(MikroORM);
    const seed = await seedData(orm);
    user = seed.seedUser;

    expected = {
      userId: user.userId,
      email: 'test@user.com',
      accessToken: 'aCceSsTok3n',
      refreshToken: 'rEfrEshTok3n',
      externalAccessToken: 'NYlaSAccEssTOk3n',
      externalAccountId: 'awa6ltos76vz5hvphkp8k17nt',
    };
  });
  afterAll(async () => await appClose(app));

  const googleCode = 'google-123';
  const nylasCode = 'nylas-123';

  const nockGoogleToken = (scope) =>
    nock('https://oauth2.googleapis.com')
      .post('/token', (body) => {
        return (
          body.code === googleCode &&
          body.redirect_uri.substr(-35) ===
            '/api/google/add-connection-callback' &&
          body.client_secret === process.env.GOOGLE_CLIENT_SECRET &&
          body.client_id.includes(process.env.GOOGLE_CLIENT_ID)
        );
      })
      .reply(200, {
        access_token: expected.accessToken,
        refresh_token: expected.refreshToken,
        token_type: 'Bearer',
        expires_in: 3600,
        scope,
      });

  const nockGoogleProfile = () =>
    nock('https://gmail.googleapis.com')
      .get('/gmail/v1/users/me/profile')
      .query(true)
      .reply(200, {
        emailAddress: expected.email,
        messagesTotal: 11,
        threadsTotal: 7,
        historyId: '12745',
      });

  const nockNylas = () => {
    nock('https://api.nylas.com/')
      .get(
        `/a/${process.env.NYLAS_CLIENT_ID}/accounts/${expected.externalAccountId}`,
      )
      .reply(200, { code: nylasCode });

    nock('https://api.nylas.com/')
      .post(
        `/a/${process.env.NYLAS_CLIENT_ID}/accounts/${expected.externalAccountId}`,
      )
      .reply(200, { code: nylasCode });
    nock('https://api.nylas.com/')
      .post(`/a/${process.env.NYLAS_CLIENT_ID}/accounts`)
      .reply(200, { code: nylasCode });
    nock('https://api.nylas.com/')
      .post('/connect/authorize')
      .reply(200, { code: nylasCode });

    nock('https://api.nylas.com/')
      .post('/connect/token', (body) => {
        return body.code === nylasCode;
      })
      .reply(200, {
        id: expected.externalAccountId,
        object: 'account',
        account_id: expected.externalAccountId,
        name: 'Dorothy Vaughan',
        provider: 'gmail',
        organization_unit: 'label',
        sync_state: 'running',
        linked_at: 1470231381,
        email_address: expected.email,
        access_token: expected.externalAccessToken,
        billing_state: 'paid',
      });
  };

  it('should execute happy path', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/google/add-connection')
      .redirects(0)
      .set('Authorization', JSON.stringify({ userId: '123', role: 'user' }))
      .send()
      .expect(302);

    expect(res.headers.location).toContain(
      'https://accounts.google.com/o/oauth2/v2/auth',
    );

    const redirectUrl = new URL(res.headers.location);
    const scope = decodeURI(redirectUrl.searchParams.get('scope'));

    //exchange tokens with google and nylas
    const redirect = 'https://webpage.com/yay';
    const state = { redirect, userId: expected.userId };
    const encodedState = btoa(JSON.stringify(state));

    nockGoogleToken(scope);
    nockGoogleProfile();
    nockNylas();

    await request(app.getHttpServer())
      .get('/api/google/add-connection-callback')
      .query({ code: googleCode, state: encodedState })
      .send()
      .expect(302)
      .expect('location', redirect);

    //wait for events to resolve
    await new Promise((resolve) => setTimeout(resolve, 100));

    //verify it persisted a connection record
    const connection = await orm.em.findOne(ConnectionEntity, {
      userId: expected.userId,
      emailAddress: expected.email,
    });

    expect(connection).toMatchObject({
      refreshToken: expected.refreshToken,
      accessToken: expected.accessToken,
      userId: expected.userId,
      nylasAccountId: expected.externalAccountId,
      nylasAccessToken: expected.externalAccessToken,
    });

    //verify it persisted a challenge connection setting record
    const challengeConnectionSettings = await orm.em.findOne(
      ChallengeConnectionSettingEntity,
      { userId: expected.userId },
    );

    expect(challengeConnectionSettings).toMatchObject({
      userId: expected.userId,
    });
  });

  it('should redirect with appropriate error when insufficient scopes are granted', async () => {
    const redirectOrigin = 'https://mysite.com';
    const redirectPath = '/redirect';
    const redirect = redirectOrigin + redirectPath;
    const state = { redirect, userId: uuidv4() };
    const encodedState = btoa(JSON.stringify(state));

    nockGoogleProfile();
    nockGoogleToken('openid');
    nockNylas();

    const response = await request(app.getHttpServer())
      .get('/api/google/add-connection-callback')
      .query({ code: googleCode, state: encodedState })
      .send()
      .expect(302);

    const redirectUrl = new URL(response.headers.location);
    expect(redirectUrl.origin).toEqual(redirectOrigin);
    expect(redirectUrl.pathname).toEqual(redirectPath);
    expect(redirectUrl.searchParams.get('error')).toEqual(
      'INSUFFICIENT_SCOPES',
    );
  });
});
