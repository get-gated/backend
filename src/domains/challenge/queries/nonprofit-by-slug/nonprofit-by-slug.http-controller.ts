import { Controller, Get, Param } from '@nestjs/common';
import { Allow, SpecialRole } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';

import { NonprofitBySlugQuery } from './nonprofit-by-slug.query';

const SLUG_PARAM = 'SLUG';
@Controller()
export class NonprofitBySlugHttpController {
  constructor(private queryBus: QueryBus) {}

  @Get(`/nonprofits/:${SLUG_PARAM}`)
  @Allow(SpecialRole.Unauthenticated)
  async getBySlug(@Param(SLUG_PARAM) slug: string): Promise<any> {
    return this.queryBus.execute(new NonprofitBySlugQuery(slug));
  }
}
