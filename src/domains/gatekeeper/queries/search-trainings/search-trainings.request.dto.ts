import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

import { SearchTrainingsType } from './search-trainings.query';

registerEnumType(SearchTrainingsType, { name: 'SearchTrainingsTypeEnum' });

@ArgsType()
@InputType()
export class SearchTrainingsFilter {
  @Field(() => Rule, { nullable: true })
  rule?: Rule;
}

@InputType('TrainingsSearchInput')
export class SearchTrainingsRequest {
  @Field({ nullable: true })
  pagination?: Pagination;

  @Field({ nullable: true, description: 'Search query for trainings' })
  query?: string;

  @Field({
    nullable: true,
    description:
      'Senders from a particular domain. Not compatible with `query`.',
  })
  forDomain?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Limit results to just domain trainings. Defaults to false',
    deprecationReason: 'In favor of `type`',
  })
  onlyDomains?: boolean;

  @Field(() => SearchTrainingsType, { nullable: true })
  type?: SearchTrainingsType;

  @Field({
    nullable: true,
  })
  filter?: SearchTrainingsFilter;
}
