import { Field, InputType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';

@InputType()
export class VolumeStatsRequestDto {
  @Field()
  @IsDate()
  startAt!: Date;

  @Field()
  @IsDate()
  endAt!: Date;
}
