import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { AddNonprofitRequest } from '../add-nonprofit/add-nonprofit.request.dto';

@InputType('NonprofitUpdateInput')
@ArgsType()
export class UpdateNonprofitRequest extends AddNonprofitRequest {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  nonprofitId!: string;
}
