import { Field, InputType } from '@nestjs/graphql';

import { HandleDto } from '../../dtos/handle.dto';

@InputType('UserHandleInput')
export class HandleRequestDto extends HandleDto implements HandleDto {
  @Field()
  override handle!: string;
}
