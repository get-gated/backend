import { Rule, Verdict } from '@app/interfaces/gatekeeper/gatekeeper.enums';
import { Field, ObjectType } from '@nestjs/graphql';

import PatternEntity from '../../entities/pattern.entity';
import TrainingEntity from '../../entities/training.entity';

@ObjectType('GatekeeperTestQueryResponse')
export class EvaluateMessageResponseDto {
  @Field()
  address: string;

  @Field(() => Rule)
  ruling: Rule;

  @Field(() => Verdict)
  verdict: Verdict;

  @Field(() => PatternEntity, { nullable: true })
  enforcedPattern?: PatternEntity;

  @Field(() => TrainingEntity, { nullable: true })
  enforcedTraining?: TrainingEntity;

  constructor(props: EvaluateMessageResponseDto) {
    this.address = props.address;
    this.ruling = props.ruling;
    this.verdict = props.verdict;
    this.enforcedPattern = props.enforcedPattern;
    this.enforcedTraining = props.enforcedTraining;
  }
}
