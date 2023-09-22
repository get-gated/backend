import { BadRequestException } from '@nestjs/common';

export class UnallowedRedirectError extends BadRequestException {
  static code = 'UNALLOWED_REDIRECT_HOST';

  static statusCode = 401;

  constructor() {
    super('Host of requested redirect is not allowed.');
  }
}
