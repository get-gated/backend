import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class ChallengeInteractionRequest {
  @Field()
  readonly challengeInteractionId!: string;
}
