import { Field, InputType } from '@nestjs/graphql';

import UserEntity from '../../entities/user.entity';

@InputType('UserUpdateInput')
export class UpdateUserRequest
  implements Pick<UserEntity, 'firstName' | 'lastName' | 'avatar'>
{
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field({ nullable: true })
  avatar?: string;
}
