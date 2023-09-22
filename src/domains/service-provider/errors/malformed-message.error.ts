/* eslint-disable @typescript-eslint/ban-types */
import { InternalServerErrorException } from '@nestjs/common';

export class MalformedMessageError extends InternalServerErrorException {
  public readonly code = 'MALFORMED_MESSAGE_FOUND';

  public readonly messageObject: object;

  constructor(messageObject: object, description?: string) {
    super(messageObject, description ?? 'Message from provider was malformed');
    this.messageObject = messageObject;
  }
}
