import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType('PatternRemoveInput')
export class PatternRemoveRequest {
  @Field()
  @IsUUID()
  patternId!: string;
}
