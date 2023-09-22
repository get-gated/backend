import { Field, InputType } from '@nestjs/graphql';

import { UserPersonalizationEntity } from '../../entities/personalization.entity';
import UserEntity from '../../entities/user.entity';

@InputType('UserPersonalizationUpdateInput')
export class UpdateUserPersonalizationRequest
  implements Pick<UserEntity, 'personalization'>
{
  @Field()
  personalization!: UserPersonalizationEntity;
}
