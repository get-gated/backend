import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType('ConnectionUnlinkInput')
export class UnlinkConnectionRequest {
  @Field()
  @IsUUID()
  connectionId!: string;

  @Field({ nullable: true })
  reasonText?: string;

  @Field({ nullable: true })
  experienceText?: string;
}
