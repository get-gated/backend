export default class MalformedMessageError extends Error {
  public readonly code = 'MALFORMED_MESSAGE';

  constructor(message: string) {
    super(message);
  }
}
