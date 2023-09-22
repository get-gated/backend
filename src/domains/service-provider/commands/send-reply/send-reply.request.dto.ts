import { IsEmail, IsString, IsUUID } from 'class-validator';

export class SendReplyRequest {
  @IsUUID()
  readonly connectionId!: string;

  @IsUUID()
  readonly messageId!: string;

  @IsEmail()
  readonly to!: string;

  @IsString()
  readonly body!: string;
}
