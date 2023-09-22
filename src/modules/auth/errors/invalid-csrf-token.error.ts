import { BadRequestException } from '@nestjs/common';

export class InvalidCsrfTokenError extends BadRequestException {
  public readonly code = 'INVALID_CSRF_TOKEN';

  constructor() {
    super('Invalid CSRF Token.');
  }
}
