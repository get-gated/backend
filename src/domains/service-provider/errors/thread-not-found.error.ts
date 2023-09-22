import { NotFoundException } from '@nestjs/common';

export class ThreadNotFoundError extends NotFoundException {
  public readonly code = 'THREAD_NOT_FOUND';

  constructor() {
    super('Thread not found with provider');
  }
}
