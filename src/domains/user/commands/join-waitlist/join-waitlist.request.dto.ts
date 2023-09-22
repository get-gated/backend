import { IsEmail, IsNotEmpty } from 'class-validator';

export class JoinWaitlistRequestDto {
  @IsEmail()
  @IsNotEmpty()
  readonly emailAddress!: string;
}
