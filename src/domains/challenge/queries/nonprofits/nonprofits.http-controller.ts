import { Controller, Get } from '@nestjs/common';
import { Allow, SpecialRole } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import { NonprofitsQuery } from './nonprofits.query';

@Controller()
export class NonprofitsHttpController {
  constructor(private queryBus: QueryBus) {}

  @Get(`/nonprofits`)
  @Allow(SpecialRole.Unauthenticated)
  async getBySlug(): Promise<any> {
    return this.queryBus.execute(new NonprofitsQuery(false));
  }
}
