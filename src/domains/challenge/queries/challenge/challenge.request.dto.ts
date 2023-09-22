import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class ChallengeRequest {
  @Field()
  readonly challengeId!: string;
}
