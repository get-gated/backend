import { Field, InputType } from '@nestjs/graphql';

@InputType('UserTasksQueryInput')
export class TasksRequestDto {
  @Field({ nullable: true })
  onlyUnresolved?: boolean;
}
