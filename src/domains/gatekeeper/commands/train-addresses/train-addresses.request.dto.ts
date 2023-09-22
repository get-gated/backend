import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';

@InputType('TrainAddressInput')
export class TrainAddressesRequest {
  @Field()
  @IsEmail()
  emailAddress!: string;

  @Field(() => Rule)
  rule!: Rule;

  @Field(() => TrainingOrigin)
  origin!: TrainingOrigin;
}
