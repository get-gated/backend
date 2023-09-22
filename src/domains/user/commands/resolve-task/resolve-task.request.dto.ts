import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { UserTask, UserTaskResolution } from '@app/interfaces/user/user.enums';

@InputType('UserTaskResolvedInput')
export class ResolveTaskRequestDto {
  @Field(() => UserTask)
  @IsNotEmpty()
  task!: UserTask;

  @Field(() => UserTaskResolution)
  @IsNotEmpty()
  resolution!: UserTaskResolution;
}
