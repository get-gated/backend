import { Cache } from 'cache-manager';

export interface CacheGetOpts {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any | (() => Promise<unknown>);
  ttl: number;
}

/**
 * Get from cache and set optional default value on miss. If the defaultValue is nullish, cache is not set.
 */
export async function getWithDefault(
  cache: Cache,
  opts: CacheGetOpts,
): Promise<unknown> {
  const { key, ttl, defaultValue } = opts;
  const result = await cache.get(key);
  if (result) {
    return result;
  }

  if (!defaultValue) {
    return;
  }

  if (typeof defaultValue === 'function') {
    const value = await defaultValue();
    if (value !== null && value !== undefined) {
      await cache.set(key, value, { ttl });
    }
    return value;
  }

  await cache.set(key, defaultValue, { ttl });
  return defaultValue;
}
