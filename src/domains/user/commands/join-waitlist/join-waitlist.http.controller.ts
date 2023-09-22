import { Body, Controller, Post } from '@nestjs/common';
import { Allow, SpecialRole } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';

import { JoinWaitlistCommand } from './join-waitlist.command';
import { JoinWaitlistRequestDto } from './join-waitlist.request.dto';

@Controller()
export class JoinWaitlistHttpController {
  static route = 'user/waitlist';

  constructor(private commandBus: CommandBus) {}

  @Post(JoinWaitlistHttpController.route)
  @Allow(SpecialRole.Unauthenticated)
  async joinWaitlist(@Body() data: JoinWaitlistRequestDto): Promise<any> {
    await this.commandBus.execute(new JoinWaitlistCommand(data.emailAddress));
  }
}
