import * as request from 'supertest';
import { NylasWebhooksGuard } from '../src/domains/service-provider/commands/_common/nylas-webhooks.guard';
import seedData from './seed-data';
import DecisionEntity from '../src/domains/gatekeeper/entities/decision.entity';
import HistoryMessageEntity from '../src/domains/service-provider/entities/history-message.entity';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import ChallengeEntity from '../src/domains/challenge/entities/challenge.entity';
import { ChallengeAction } from '@app/interfaces/challenge/challenge.enums';
import { Label } from '@app/interfaces/service-provider/service-provider.enums';
import MoveThreadLogEntity from '../src/domains/service-provider/entities/move-thread-log.entity';
import HistoryThreadEntity from '../src/domains/service-provider/entities/history-thread.entity';
import { appClose, appInit } from './app-init-close';
import { MikroORM } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nock = require('nock');

describe('Gated & Challenged Message (e2e)', () => {
  let app, orm, connection;

  beforeAll(async () => {
    app = await appInit();
    orm = app.get(MikroORM);
    const seed = await seedData(orm);
    connection = seed.seedConnection;
  });
  afterAll(async () => {
    await appClose(app);
  });

  it('it should gate an unknown sender', async () => {
    const messageId = uuidv4();
    const threadId = uuidv4();
    const payload = {
      deltas: [
        {
          delta: {
            date: new Date().getTime() / 1000,
            object: 'message',
            type: 'message.created',
            object_data: {
              namespace_id: '123',
              object: 'message',
              id: messageId,
              account_id: connection.externalAccountId,
              attributes: {
                thread_id: threadId,
                received_date: new Date().getTime() / 1000,
              },
            },
          },
        },
      ],
    };
    const signature = NylasWebhooksGuard.signature(
      JSON.stringify(payload),
      process.env.NYLAS_CLIENT_SECRET,
    );

    nock('https://api.nylas.com/')
      .get(
        `/a/${process.env.NYLAS_CLIENT_ID}/accounts/${connection.externalAccountId}`,
      )
      .reply(200);

    const mockMessage = {
      id: messageId,
      subject: 'test subject',
      from: [{ email: 'unknown@sender.com', name: 'Unknown Sender' }],
      to: [{ email: connection.emailAddress, name: 'Gated User' }],
      date: new Date().getTime() / 1000,
      thread_id: threadId,
      unread: true,
      starred: false,
      labels: [{ name: 'inbox', display_name: 'inbox' }],
      headers: {},
    };

    nock('https://api.nylas.com/')
      .get(`/messages/${messageId}`)
      .twice() //once for initial fetch, and once for the reply
      .reply(200, mockMessage);

    const mockThread = {
      id: threadId,
      subject: 'thread subject',
      participants: [...mockMessage.from, ...mockMessage.to],
      last_message_timestamp: new Date().getTime() / 1000,
      last_message_received_timestamp: new Date().getTime() / 1000,
      last_message_sent_timestamp: new Date().getTime() / 1000,
      first_message_timestamp: new Date().getTime() / 1000,
      unread: true,
      starred: false,
      labels: mockMessage.labels,
      messageIds: [messageId],
    };

    const mockSentMessage = {
      id: uuidv4(),
      subject: mockMessage.subject,
      from: [{ email: connection.emailAddress, name: 'Gated User' }],
      to: [{ email: 'unknown@sender.com', name: 'Unknown Sender' }],
      date: new Date().getTime() / 1000,
      thread_id: threadId,
      unread: false,
      starred: false,
      labels: [{ name: 'sent', display_name: 'sent' }],
      headers: { 'X-Gated-Challenge-Email': true },
    };

    nock('https://api.nylas.com/')
      .get(`/threads/${threadId}`)
      .twice()
      .reply(200, mockThread);

    nock('https://api.nylas.com/')
      .put(`/threads/${threadId}`)
      .reply(200, mockThread);

    nock('https://api.nylas.com/').post('/send').reply(200, mockSentMessage);

    nock('https://api.nylas.com/')
      .get(`/labels/${Label.Gated}`)
      .times(4)
      .reply(200, { id: 'label1' });

    nock('https://api.sendgrid.com/').post('/v3/mail/send').reply(200, {});

    await request(app.getHttpServer())
      .post('/api/nylas/message-created')
      .set('X-Nylas-Signature', signature)
      .send(payload)
      .expect(201);

    await new Promise((resolve) => setTimeout(resolve, 500));

    // get the newly created message and thread
    const newMessage = await orm.em.findOneOrFail(HistoryMessageEntity, {
      externalMessageId: mockMessage.id,
    });
    const newThread = await orm.em.findOneOrFail(HistoryThreadEntity, {
      externalThreadId: mockThread.id,
    });

    //expect a gatekeeper decision record
    const decision = await orm.em.findOne(DecisionEntity, {
      messageId: newMessage.messageId,
    });
    expect(decision.ruling).toEqual(Rule.Gate);

    //expect a challenge action
    const challenge = await orm.em.findOne(ChallengeEntity, {
      messageId: newMessage.messageId,
    });
    expect(challenge.action).toEqual(ChallengeAction.Present);

    //expect move thread record to be created
    await orm.em.findOneOrFail(MoveThreadLogEntity, {
      thread: newThread,
    });

    //expect the challenge to be sent via service provider
    await orm.em.findOneOrFail(HistoryMessageEntity, {
      externalMessageId: mockSentMessage.id,
    });
  });
});
