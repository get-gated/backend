import assert from 'assert';

import { withRetry } from './index';

describe('utils', () => {
  describe('withRetry', () => {
    it('should perform retries', async () => {
      let tries = 0;
      const testFn = (arg: string): void => {
        tries += 1;
        expect(arg).not.toBeFalsy();
        throw new Error('fail');
      };

      const testFnWithRetry = withRetry(testFn, {
        delayMs: 10,
        maxAttempts: 2,
      });

      try {
        await testFnWithRetry('hello');
        assert.fail('should have failed');
      } catch (_e) {
        // no-op
      }
      expect(tries).toBe(2);
    });
  });
});
