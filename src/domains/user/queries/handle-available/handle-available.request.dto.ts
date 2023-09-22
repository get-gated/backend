import { Field, InputType } from '@nestjs/graphql';

import { HandleDto } from '../../dtos/handle.dto';

@InputType('UserHandleAvailableQueryInput')
export class HandleAvailableRequestDto extends HandleDto implements HandleDto {
  @Field()
  override handle!: string;
}
