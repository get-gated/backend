import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Allow, SpecialRole } from '@app/modules/auth';

import { AuthWithIdTokenRequestDto } from './auth-with-id-token.request.dto';
import { AuthWithIdTokenResponseDto } from './auth-with-id-token.response.dto';
import { AuthWithIdTokenCommand } from './auth-with-id-token.command';

@Controller()
export class AuthWithIdTokenHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/user/auth-with-id-token')
  @Allow(SpecialRole.Unauthenticated)
  async auth(
    @Body() { idToken, provider }: AuthWithIdTokenRequestDto,
  ): Promise<AuthWithIdTokenResponseDto> {
    const customToken = await this.commandBus.execute(
      new AuthWithIdTokenCommand(idToken, provider),
    );
    return { customToken };
  }
}
