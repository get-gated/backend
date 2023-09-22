import {
  Args,
  ArgsType,
  Field,
  InputType,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IsUUID } from 'class-validator';

import UserEntity from '../../entities/user.entity';

import { OffboardCommand } from './offboard.command';

@InputType()
@ArgsType()
class DisableUserRequest {
  @Field()
  @IsUUID()
  userId!: string;
}

@InputType()
class DeleteAccountRequest {
  @Field({ nullable: true })
  reasonText?: string;

  @Field({ nullable: true })
  experienceText?: string;
}

@Resolver()
export class OffboardGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => UserEntity, {
    deprecationReason: 'offboard mutation is preferred method',
  })
  @Allow(Role.Admin)
  async disableUser(
    @Args() { userId }: DisableUserRequest,
  ): Promise<UserEntity> {
    return this.commandBus.execute(new OffboardCommand(userId));
  }

  @Mutation(() => UserEntity)
  @Allow(Role.User)
  async offboard(
    @User() { userId }: AuthedUser,
    @Args('input') { reasonText, experienceText }: DeleteAccountRequest,
  ): Promise<UserEntity> {
    return this.commandBus.execute(
      new OffboardCommand(userId, reasonText, experienceText),
    );
  }
}
