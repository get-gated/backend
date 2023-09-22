export default class QuotaExceededError extends Error {
  public readonly code = 'QUOTA_EXCEEDED';

  constructor(message: string) {
    super(message);
  }
}
