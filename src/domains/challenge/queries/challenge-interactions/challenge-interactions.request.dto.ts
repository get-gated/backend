import { Field, InputType } from '@nestjs/graphql';
import { Pagination } from '@app/modules/graphql';
import { ChallengeInteraction } from '@app/interfaces/challenge/challenge.enums';

@InputType('ChallengeInteractionsInput')
export class ChallengeInteractionsRequest {
  @Field({ nullable: true })
  readonly pagination?: Pagination;

  @Field(() => ChallengeInteraction, { nullable: true })
  interaction!: ChallengeInteraction;
}
