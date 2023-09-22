import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { UserBenefit } from '@app/interfaces/user/user.enums';
import {
  UserBenefitSelectionInterface,
  UserPersonalizationInterface,
} from '@app/interfaces/user/user-personalization.interface';

registerEnumType(UserBenefit, { name: 'UserBenefitEnum' });

@InputType()
@ObjectType('UserBenefitSelection')
export class UserBenefitSelectionEntity
  implements UserBenefitSelectionInterface
{
  @Field(() => UserBenefit)
  userBenefit!: UserBenefit;

  @Field()
  benefitLabel!: string;

  @Field()
  otherText!: string;
}

@InputType()
@ObjectType('UserPersonalization')
export class UserPersonalizationEntity implements UserPersonalizationInterface {
  @Field(() => UserBenefitSelectionEntity)
  userBenefitSelection!: UserBenefitSelectionEntity;
}
