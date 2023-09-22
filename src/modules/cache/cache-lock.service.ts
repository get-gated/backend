import { Cache } from 'cache-manager';
import { Injectable } from '@nestjs/common';

import { GenericFunction } from '../utils';

export class ConcurrentProcessingError extends Error {}

export interface CacheLockOpts {
  cache: Cache;
  /** how long the initial cache lock should stay in place */
  ttl?: number;
  /** whether or not cache lock should be continually extended and how long (in seconds) */
  extTtl?: number;
  cacheKey: string;
  value?: any;
}

export interface Lock {
  clear: () => Promise<void>;
}

export async function getCacheLock({
  cache,
  cacheKey,
  ttl = 20,
  extTtl,
  value = 1,
}: CacheLockOpts): Promise<Lock> {
  const client = (cache.store as any).getClient();
  const acquired = await new Promise((resolve, reject) => {
    client.set(
      cacheKey,
      value,
      'EX',
      ttl,
      'NX',
      (err: unknown, result: unknown) => {
        if (err) {
          reject(err);
        }
        resolve(!!result);
      },
    );
  });

  if (!acquired) {
    throw new ConcurrentProcessingError();
  }

  let running = true;
  let timeout: NodeJS.Timeout | undefined;

  if (extTtl) {
    const extendExpiration = async (): Promise<void> => {
      await client.expire(cacheKey, extTtl);
      if (!running) {
        return;
      }
      timeout = setTimeout(extendExpiration, extTtl * 1000 - 100);
    };

    timeout = setTimeout(extendExpiration, ttl * 1000 - 200);
  }

  return {
    clear: async () => {
      running = false;
      if (timeout) {
        clearTimeout(timeout);
      }
      await cache.del(cacheKey);
    },
  };
}

/**
 * WARNING: for some reason execution of function passed here loses whatever mikroorm related context
 * information causing mikroorm invocations to fail with
 * `You cannot call em.flush() from inside lifecycle hook handlers`. This only occurs if you import this
 * directly and don't "inject" it in nestjs style.
 */
async function doCacheLock(
  opts: CacheLockOpts,
  fn: GenericFunction,
): Promise<Awaited<ReturnType<typeof fn>>> {
  const cacheLock = await getCacheLock(opts);
  try {
    return await fn();
  } finally {
    await cacheLock.clear();
  }
}

@Injectable()
export class CacheLock {
  // eslint-disable-next-line class-methods-use-this
  withLock(
    opts: CacheLockOpts,
    fn: GenericFunction,
  ): Promise<Awaited<ReturnType<typeof fn>>> {
    return doCacheLock(opts, fn);
  }
}
