/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { gmail_v1 } from 'googleapis';
import { LoggerService } from '@app/modules/logger';
import { DeepPartial, DeepValueOverride, withRetry } from '@app/modules/utils';

import { isQuotaError } from '../util';

import { withReservation } from './rate-limiter';
import { checkoutId } from './client-id';

type Resource$Users = gmail_v1.Resource$Users;

/**
 * Gmail API per-method quota usage units.
 */
const quotaSpec: DeepPartial<DeepValueOverride<Resource$Users, number>> = {
  drafts: {
    create: 10,
    delete: 10,
    get: 5,
    list: 5,
    send: 100,
    update: 15,
  },
  getProfile: 1,
  history: {
    list: 2,
  },
  labels: {
    create: 5,
    delete: 5,
    get: 1,
    list: 1,
    update: 5,
  },
  messages: {
    attachments: {
      get: 5,
    },
    batchDelete: 50,
    delete: 10,
    get: 5,
    import: 25,
    insert: 25,
    list: 5,
    modify: 5,
    send: 100,
    trash: 5,
    untrash: 5,
  },
  settings: {
    delegates: {
      create: 100,
      delete: 5,
      get: 1,
      list: 1,
    },
    filters: {
      create: 5,
      delete: 5,
      get: 1,
      list: 1,
    },
    forwardingAddresses: {
      create: 100,
      delete: 5,
      get: 1,
      list: 1,
    },
    getAutoForwarding: 1,
    getImap: 1,
    getPop: 1,
    getVacation: 1,
    sendAs: {
      create: 100,
      delete: 5,
      get: 1,
      list: 1,
      update: 100,
      verify: 100,
    },
    updateAutoForwarding: 5,
    updateImap: 5,
    updatePop: 100,
    updateLanguage: 5, // this isn't listed in the quota docs
    updateVacation: 5,
  },
  stop: 50,
  threads: {
    delete: 20,
    get: 10,
    list: 10,
    modify: 10,
    trash: 10,
    untrash: 10,
  },
  watch: 100,
};

/**
 * Wraps all functions that have quota limits based on the spec.
 */
function addQuotas(
  // eslint-disable-next-line default-param-last
  spec = quotaSpec,
  obj: any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  rateLimitId: Object,
  log: LoggerService,
  parent?: string,
): void {
  Object.entries(spec).forEach(([key]) => {
    const quota = (spec as any)[key];
    const target = obj[key];

    if (typeof quota !== 'number' && typeof target === 'object') {
      return addQuotas(quota, target, rateLimitId, log, key);
    }

    if (typeof target === 'function') {
      const origFn = target.bind(obj);
      const retryFn = withRetry((...args: any[]) => origFn(...args), {
        delayMs: 300,
        maxAttempts: 4,
        backoffMultiplier: 1.7,
        randomnessMarginMs: 100,
        shouldAbort: (err) => !isQuotaError(err),
        onRetry: (attempt) => {
          const method = parent ? `${parent}.${key}` : key;
          log.warn({ method, attempt }, `quota limit error, retrying`);
        },
      });

      obj[key] = (...args: any[]) => {
        const method = parent ? `${parent}.${key}` : key;
        log.info({ method, quota }, `calling google api method`);

        return withReservation(rateLimitId, quota, () => retryFn(...args));
      };
    }
  });
}

/**
 * Mutates the given gmail client by applying ratelimiting handling to all api methods.
 */
export function rateLimit(
  client: gmail_v1.Gmail,
  clientId: string,
  log: LoggerService,
): gmail_v1.Gmail {
  // need to obtain a single canonical instance of a key used as a weak reference by the rate limiter
  const rateLimitId = checkoutId(clientId, client);

  // need to create a strong reference to the rateLimitId since it's stored as a weak reference
  // eslint-disable-next-line no-underscore-dangle, no-param-reassign
  (client.context as any).__rateLimitClientId = rateLimitId;

  addQuotas(quotaSpec, client.users, rateLimitId, log);

  return client;
}
