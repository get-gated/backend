import { Field, InputType } from '@nestjs/graphql';
import { IsFQDN } from 'class-validator';
import {
  Rule,
  TrainingOrigin,
} from '@app/interfaces/gatekeeper/gatekeeper.enums';

@InputType('TrainDomainInput')
export class TrainDomainsRequest {
  @Field()
  @IsFQDN()
  domain!: string;

  @Field(() => Rule)
  rule!: Rule;

  @Field(() => TrainingOrigin)
  origin!: TrainingOrigin;
}
