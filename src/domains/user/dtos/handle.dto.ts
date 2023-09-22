import { IsAlphanumeric, IsNotIn, Length } from 'class-validator';

export class HandleDto {
  @IsAlphanumeric()
  @Length(3, 15)
  @IsNotIn(['api'])
  handle!: string;
}
