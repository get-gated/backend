import { NotFoundException } from '@nestjs/common';

export class MessageNotFoundError extends NotFoundException {
  public readonly code = 'MESSAGE_NOT_FOUND';

  constructor() {
    super('Message not found with provider');
  }
}
