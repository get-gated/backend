import { Controller, Post, Res } from '@nestjs/common';
import { Allow, Role } from '@app/modules/auth';
import { Response } from 'express';

@Controller()
export class LogoutHttpController {
  static route = 'user/auth/logout';

  @Post(LogoutHttpController.route)
  @Allow([Role.User, Role.Admin])
  logout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie('authorization');
  }
}
