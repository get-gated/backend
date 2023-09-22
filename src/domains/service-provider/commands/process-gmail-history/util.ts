import { isNullish, Maybe } from '@app/modules/utils';

export function getLastHistoryIdCacheKey(emailAddress: string): string {
  return `process-gmail-history-lastHistoryId-google-${emailAddress.toLowerCase()}`;
}

/**
 * @returns true if historyId1 is greater than historyId2
 */
export function isGreater(
  historyId1: Maybe<string>,
  historyId2: Maybe<string>,
): boolean {
  if (isNullish(historyId1)) {
    return false;
  }
  if (isNullish(historyId2)) {
    return true;
  }
  return (
    parseInt(historyId1 as string, 10) > parseInt(historyId2 as string, 10)
  );
}
