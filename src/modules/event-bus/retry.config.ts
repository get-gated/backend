import { RetryOptions } from 'google-gax/build/src/gax';

const retry: RetryOptions = {
  retryCodes: [
    10, // 'ABORTED'
    1, // 'CANCELLED',
    4, // 'DEADLINE_EXCEEDED'
    13, // 'INTERNAL'
    8, // 'RESOURCE_EXHAUSTED'
    14, // 'UNAVAILABLE'
    2, // 'UNKNOWN'
  ],
  backoffSettings: {
    // The initial delay time, in milliseconds, between the completion
    // of the first failed request and the initiation of the first retrying request.
    initialRetryDelayMillis: 500,
    // The multiplier by which to increase the delay time between the completion
    // of failed requests, and the initiation of the subsequent retrying request.
    retryDelayMultiplier: 2,
    // The maximum delay time, in milliseconds, between requests.
    // When this value is reached, retryDelayMultiplier will no longer be used to increase delay time.
    maxRetryDelayMillis: 60000,
    // The initial timeout parameter to the request.
    initialRpcTimeoutMillis: 5000,
    // The multiplier by which to increase the timeout parameter between failed requests.
    rpcTimeoutMultiplier: 1.0,
    // The maximum timeout parameter, in milliseconds, for a request. When this value is reached,
    // rpcTimeoutMultiplier will no longer be used to increase the timeout.
    maxRpcTimeoutMillis: 600000,
    // The total time, in milliseconds, starting from when the initial request is sent,
    // after which an error will be returned, regardless of the retrying attempts made meanwhile.
    totalTimeoutMillis: 600000,
  },
};

export default retry;
