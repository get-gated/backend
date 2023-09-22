/* eslint-disable no-throw-literal */
import * as assert from 'assert';

import { Test, TestingModule } from '@nestjs/testing';
import { GaxiosPromise } from 'gaxios';
import { gmail_v1 } from 'googleapis';
import { DeepPartial, UtilsService } from '@app/modules/utils';
import { CryptoService } from '@app/modules/crypto';
import { LoggerService } from '@app/modules/logger';
import { EventBusService } from '@app/modules/event-bus';

import Config, {
  ServiceProviderConfig,
} from '../../../../service-provider.config';
import { HistoryIdNotFoundError } from '../../../../errors/history-id-not-found.error';
import { connectionEntity, mockGmailClient } from '../../../../test/util';

import { GoogleService } from './google.service';

const cryptoServiceMock = {
  decrypt: jest.fn(),
  encrypt: jest.fn(),
};

const eventBusMock: Partial<EventBusService> = {
  publish: jest.fn(),
  getTopicName: jest.fn(),
};

describe('GmailService', () => {
  let service: GoogleService;

  const mockConfig: ServiceProviderConfig = {
    google: {
      gmailHistory: {
        getHistoryRetry: {
          delayMs: 2,
          maxAttempts: 3,
        },
      },
      gmail: {
        calendar: {
          fetchAttachments: false,
        },
        getMessageRetry: {
          delayMs: 2,
          maxAttempts: 3,
        },
        messageChangeConcurrency: 1,
      },
    },
  } as ServiceProviderConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleService,
        { provide: LoggerService, useValue: console },
        { provide: Config.KEY, useValue: mockConfig },
        { provide: UtilsService, useValue: {} },
        { provide: CryptoService, useValue: cryptoServiceMock },
        { provide: EventBusService, useValue: eventBusMock },
      ],
    }).compile();

    service = module.get<GoogleService>(GoogleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('containsCalendarEvent', () => {
    it('if the payload contains an event, we should find it', () => {
      const message = {
        payload: {
          mimeType: 'any/mimetype',
          parts: [
            {
              filename: 'anything.ics',
              mimeType: 'any/mimetype',
            },
          ],
        },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const containsCalendarEvent = service.containsCalendarEvent(
        message.payload,
      );
      expect(containsCalendarEvent);
    });

    it('if there are no files, we should not find a calendar event', () => {
      const message = {
        payload: {
          mimeType: 'any/mimetype',
          parts: [],
        },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const containsCalendarEvent = service.containsCalendarEvent(
        message.payload,
      );
      expect(!containsCalendarEvent);
    });

    it('if there are no parts, we should not find a calendar event', () => {
      const message = {
        payload: {
          mimeType: 'any/mimetype',
        },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const containsCalendarEvent = service.containsCalendarEvent(
        message.payload,
      );
      expect(!containsCalendarEvent);
    });

    it('if none of the attachments are ics files, we should not find a calendar event', () => {
      const message = {
        payload: {
          mimeType: 'any/mimetype',
          parts: [
            {
              filename: '',
              mimeType: 'any/mimetype',
            },
            {
              filename: 'file.txt',
              mimeType: 'any/mimetype',
            },
          ],
        },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const containsCalendarEvent = service.containsCalendarEvent(
        message.payload,
      );
      expect(!containsCalendarEvent);
    });
  });

  describe('getGmailMessage', () => {
    const connection = connectionEntity();
    const getMessageFn: jest.Mock = jest.fn();
    let client: gmail_v1.Gmail;

    beforeEach(() => {
      getMessageFn.mockClear();
      client = mockGmailClient(service, {
        users: {
          messages: {
            get: getMessageFn,
          },
        },
      }) as unknown as gmail_v1.Gmail;
    });

    it('should fail immediately if the error is not a 404', async () => {
      getMessageFn.mockImplementation(() => {
        throw { code: 500 };
      });
      try {
        await service.getGmailMessage(client, 'foo', connection);
        fail('should have failed');
      } catch (e) {
        // noop
      }
      expect(getMessageFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMessageChangesFromHistory', () => {
    type HistoryListResponse =
      GaxiosPromise<gmail_v1.Schema$ListHistoryResponse>;
    let historyListFn: jest.Mock;

    const connection = connectionEntity();

    beforeEach(() => {
      historyListFn = jest.fn();

      mockGmailClient(service, {
        users: {
          history: {
            list: historyListFn,
          },
        },
      });
    });

    it('should retry up to configured threshold', async () => {
      mockConfig.google.gmailHistory.getHistoryRetry.maxAttempts = 3;
      historyListFn
        .mockImplementationOnce(() => {
          throw { response: { status: 404 } };
        })
        .mockImplementationOnce(() => {
          throw { response: { status: 404 } };
        })
        .mockImplementation(
          (): DeepPartial<HistoryListResponse> =>
            Promise.resolve({
              status: 200,
              data: {
                history: [
                  {
                    id: '1',
                    labelsAdded: [],
                    labelsRemoved: [],
                    messages: [],
                    messagesAdded: [],
                    messagesDeleted: [],
                  },
                ],
              },
            }),
        );

      const result = await service.getMessageChangesFromHistory(connection);
      expect(result).toBeTruthy();

      expect(historyListFn).toHaveBeenCalledTimes(3);
    });

    it('should fail retry after configured threshold', async () => {
      mockConfig.google.gmailHistory.getHistoryRetry.maxAttempts = 1;
      historyListFn.mockImplementationOnce(() => {
        throw { response: { status: 404 } };
      });

      try {
        await service.getMessageChangesFromHistory(connection);
        assert.fail('should have failed');
      } catch (e) {
        expect(e).toBeInstanceOf(HistoryIdNotFoundError);
      }
    });

    it('should not retry if error is not HistoryIdNotFound', async () => {
      mockConfig.google.gmailHistory.getHistoryRetry.maxAttempts = 2;
      historyListFn.mockImplementation(() => {
        throw new Error('n/a');
      });
      try {
        await service.getMessageChangesFromHistory(connection);
        assert.fail('should have failed');
      } catch (e) {
        expect(e).not.toBeInstanceOf(HistoryIdNotFoundError);
      }
      expect(historyListFn).toHaveBeenCalledTimes(1);
    });
  });
});
