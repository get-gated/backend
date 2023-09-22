import { Field, InputType } from '@nestjs/graphql';

@InputType('ChallengeUserSettingsUpdateInput')
export class UserSettingsRequest {
  @Field()
  nonprofitId!: string;

  @Field({ nullable: true })
  minimumDonation?: number;

  @Field({ nullable: true })
  signature?: string;

  @Field({ nullable: true })
  injectResponses?: boolean;

  @Field({ nullable: true })
  nonprofitReason?: string;
}
