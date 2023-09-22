import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenError extends UnauthorizedException {
  public readonly code = 'INVALID_TOKEN';

  constructor() {
    super('Token is no longer valid. Reauthorize user.');
  }
}
