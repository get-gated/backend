import { IsBase64, IsNotEmpty } from 'class-validator';

export class SenderChallengeRequestDto {
  @IsBase64()
  @IsNotEmpty()
  readonly token!: string;
}
