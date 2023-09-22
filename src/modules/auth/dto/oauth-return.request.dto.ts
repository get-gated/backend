import { IsNotEmpty, IsOptional } from 'class-validator';

export class OauthReturnRequestDto {
  @IsOptional()
  readonly code?: string;

  @IsOptional()
  readonly error?: string;

  @IsNotEmpty()
  readonly state!: string;
}
