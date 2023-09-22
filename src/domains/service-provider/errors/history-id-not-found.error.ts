import { NotFoundException } from '@nestjs/common';

export class HistoryIdNotFoundError extends NotFoundException {
  public readonly code = 'HISTORY_ID_NOT_FOUND';

  constructor(error?: unknown) {
    super(error, 'History ID not found with provider');
  }
}
