import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

import { AddPatternRequest } from '../add-pattern/add-pattern.request.dto';

@InputType('PatternUpdateInput')
export class UpdatePatternRequest extends AddPatternRequest {
  @Field()
  @IsUUID()
  patternId!: string;
}
