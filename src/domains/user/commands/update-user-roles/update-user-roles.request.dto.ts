import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Role } from '@app/modules/auth';
import { IsUUID } from 'class-validator';

import UserEntity from '../../entities/user.entity';

@InputType()
@ArgsType()
export class UpdateUserRolesRequest implements Pick<UserEntity, 'roles'> {
  @Field()
  @IsUUID()
  userId!: string;

  @Field(() => [Role])
  roles!: Role[];
}
