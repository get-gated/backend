import { Field, InputType } from '@nestjs/graphql';
import { ChallengeMode } from '@app/interfaces/challenge/challenge.enums';
import { IsUUID, ValidateIf } from 'class-validator';

@InputType('ChallengeConnectionSettingsInput')
export class ConnectionSettingsRequest {
  @Field()
  @IsUUID()
  userId!: string;

  @Field()
  @IsUUID()
  connectionId!: string;

  @Field(() => ChallengeMode)
  mode!: ChallengeMode;

  @Field({ nullable: true })
  @ValidateIf((e) => e.templateId)
  @IsUUID()
  templateId?: string;

  @Field({ nullable: true })
  greetingBlock?: string;

  @Field({ nullable: true })
  leadBlock?: string;

  @Field({ nullable: true })
  donateBlock?: string;

  @Field({ nullable: true })
  expectedBlock?: string;

  @Field({ nullable: true })
  signatureBlock?: string;
}
