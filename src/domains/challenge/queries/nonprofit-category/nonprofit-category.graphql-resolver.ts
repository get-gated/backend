import {
  Args,
  Context,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { IGraphqlContext } from '@app/modules/graphql';
import { Allow, SpecialRole } from '@app/modules/auth';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import NonprofitCategoryEntity from '../../entities/nonprofit-category.entity';
import NonprofitEntity from '../../entities/nonprofit.entity';

import { NonprofitCategoryHandler } from './nonprofit-category.handler';

@Resolver(() => NonprofitCategoryEntity)
export class NonprofitCategoryGraphqlResolver {
  constructor(
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
    @InjectRepository(NonprofitCategoryEntity)
    private nonprofitCategoryRepo: EntityRepository<NonprofitCategoryEntity>,
  ) {}

  @Query(() => NonprofitCategoryEntity)
  @Allow(SpecialRole.AllAuthenticated)
  async nonprofitCategory(
    @Args('id', { type: () => ID }) nonprofitCategoryId: string,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<NonprofitCategoryEntity> {
    return loaders.nonprofitCategory.load(nonprofitCategoryId);
  }

  @ResolveField(() => [NonprofitCategoryHandler])
  async nonprofits(
    @Parent() { nonprofitCategoryId }: NonprofitCategoryEntity,
  ): Promise<NonprofitEntity[]> {
    return this.nonprofitRepo.find({
      category: this.nonprofitCategoryRepo.getReference(nonprofitCategoryId),
    });
  }
}
