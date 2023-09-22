import { BadRequestException } from '@nestjs/common';

export class ExpiredTokenException extends BadRequestException {
  static code = 'TOKEN_EXPIRED';

  static statusCode = 401;

  constructor() {
    super('Token is expired');
  }
}
