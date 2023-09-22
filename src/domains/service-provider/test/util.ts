// eslint-disable-next-line import/no-extraneous-dependencies
import * as merge from 'deepmerge';
import { gmail_v1 } from 'googleapis';
import {
  Provider,
  Status,
} from '@app/interfaces/service-provider/service-provider.enums';
import { DeepPartial } from '@app/modules/utils';

import ConnectionEntity from '../entities/connection.entity';
import { GoogleService } from '../services/provider/adapters/google/google.service';

export function randomString(length = 10, bits = 36): any {
  let outStr = '';
  let newStr;
  while (outStr.length < length) {
    newStr = Math.random().toString(bits).slice(2);
    outStr += newStr.slice(0, Math.min(newStr.length, length - outStr.length));
  }
  return outStr;
}

export function connectionEntity(
  data: Partial<ConnectionEntity> = {},
): ConnectionEntity {
  const connection = new ConnectionEntity({
    emailAddress: randomString(),
    externalAccessToken: randomString(),
    externalAccountId: randomString(),
    isDisabled: false,
    provider: Provider.Google,
    providerToken: randomString(),
    providerUserId: randomString(),
    status: Status.Running,
    userId: randomString(),
    isActivated: true,
    ...data,
  });
  return Object.assign(connection, {
    trainAsAllowedLabelId: 'allowed',
    trainAsGatedLabelId: 'gated',
    lastHistoryId: randomString(),
  });
}

export function mockGmailClient<T extends DeepPartial<gmail_v1.Gmail>>(
  service: GoogleService,
  overrides?: T,
): DeepPartial<gmail_v1.Gmail> & T {
  const mockClient: T = merge(
    {
      context: {},
      users: {
        history: {
          list: jest.fn(),
        },
        messages: {
          get: jest.fn(),
        },
      },
    },
    overrides ?? {},
  ) as T; // whatever was passed in is going to exist

  // override the private gmailClient method (have to use 'any')
  jest
    .spyOn(service as any, 'gmailClient')
    .mockImplementation(
      (): Promise<DeepPartial<gmail_v1.Gmail>> => Promise.resolve(mockClient),
    );

  return mockClient;
}
