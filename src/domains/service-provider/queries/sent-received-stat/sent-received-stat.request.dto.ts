import { Field, InputType } from '@nestjs/graphql';

@InputType('SentReceivedStatQueryInput')
export class SentReceivedStatRequestDto {
  @Field()
  sender!: string;
}
