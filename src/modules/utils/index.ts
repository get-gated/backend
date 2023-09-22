export * from './utils.module';
export * from './utils.service';

export interface GenericFunction {
  (...args: any[]): any;
}

type primitives =
  | string
  | boolean
  | number
  | BigInt
  | Date
  | string[]
  | boolean[]
  | number[]
  | BigInt[]
  | Date[];

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends primitives
    ? T[K]
    : T[K] extends (infer U)[]
    ? DeepPartial<U>[]
    : DeepPartial<T[K]>;
};

/**
 * Recursively make all properties required.
 */
export type DeepRequires<T> = {
  [K in keyof T]: T[K] extends primitives
    ? T[K]
    : T[K] extends (infer U)[]
    ? DeepPartial<U>[]
    : DeepPartial<T[K]>;
};

/**
 * Recursively change the value type of an object.
 */
export type DeepValueOverride<T, V> = {
  // if value is a function, then set it to V
  // otherwise, recurse while accounting for arrays
  [K in keyof T]: T[K] extends GenericFunction
    ? V
    : T[K] extends (infer U)[]
    ? DeepValueOverride<U, V>[]
    : DeepValueOverride<T[K], V>;
};

export type Maybe<T> = null | undefined | T;

export type NonEmptyArray<T> = [T, ...T[]];

export interface WithRetryOpts {
  delayMs: number;
  maxAttempts: number;
  backoffMultiplier?: number;
  /** indicates that retries should be scheduled with a degree of randomness using a range of `delayMs` +/- `randomnessMargin` */
  randomnessMarginMs?: number;
  shouldAbort?: (error: unknown, attempt: number) => boolean;
  onSuccess?: (attempt: number) => unknown;
  onRetry?: (attempt: number) => unknown;
}

export interface WithRetry<T extends GenericFunction> {
  (...a: Parameters<T>): Promise<Awaited<ReturnType<T>>>;
}

/**
 * @param mills milliseconds to delay
 */
export async function delay(mills: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, mills);
  });
}

/**
 * Returns a given function wrapped in an async
 * function that will perform retries.
 *
 * @param {WithRetryOpts} options - options
 * @param {number|undefined} options.delayMs - How long to wait between attempts. Default 500.
 * @param {number|undefined} options.backoffMultiplier - Increase time per retry by this amount. should be greater than 1 or defaults to 1 (for no backoff).
 *
 * example:
 * ```typescript
 *   const getFooWithRetry = withRetry(() => {
 *     // ... some call that might fail
 *   });
 *   const foo = await getFooWithRetry();
 * ```
 */
export function withRetry<T extends GenericFunction>(
  fn: T,
  opts?: WithRetryOpts,
): WithRetry<T> {
  const {
    delayMs = 500,
    maxAttempts = 3,
    backoffMultiplier = 1,
    randomnessMarginMs = 0,
    onSuccess,
    onRetry,
    shouldAbort,
  } = opts ?? {};

  let delayTime = delayMs;
  const run = async (
    args: Parameters<T>,
    attempt = 1,
  ): Promise<Awaited<ReturnType<T>>> => {
    try {
      const result = await fn(...args);
      onSuccess?.(attempt);
      return result;
    } catch (e) {
      if (attempt < maxAttempts && !shouldAbort?.(e, attempt)) {
        delayTime *= backoffMultiplier;
        if (randomnessMarginMs) {
          const max = delayTime + randomnessMarginMs;
          const min = delayTime - randomnessMarginMs;
          delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        await delay(delayMs);
        onRetry?.(attempt + 1);
        return run(args, attempt + 1);
      }
      throw e;
    }
  };
  return (...args) => run(args);
}

export function isNullish<T>(value: Maybe<T>): boolean {
  return value === null || value === undefined;
}

export function hoursAgoFromDate(date: Date, hours: number): Date {
  const targetDate = new Date(date.getTime());
  targetDate.setHours(targetDate.getHours() - hours);
  return targetDate;
}

export function envOrFail(envVarName: string): string {
  if (!process.env[envVarName]) {
    throw new Error(`Environment variable '${envVarName}' must be defined.`);
  }
  return process.env[envVarName] as string;
}
