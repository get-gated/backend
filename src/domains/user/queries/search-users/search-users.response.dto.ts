import { Field, ObjectType } from '@nestjs/graphql';

import UserEntity from '../../entities/user.entity';

@ObjectType('UserSearchResponse')
export class SearchUsersResponse {
  @Field(() => [UserEntity])
  results!: UserEntity[];
}
