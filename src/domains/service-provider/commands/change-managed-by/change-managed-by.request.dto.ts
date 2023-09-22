import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

import { ManagedBy } from '../../service-provider.enums';

@InputType('ConnectionChangeManagedByInput')
export class ChangeManagedByRequestDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly connectionId!: string;

  @Field(() => ManagedBy)
  @IsEnum(ManagedBy)
  @IsNotEmpty()
  readonly manageBy!: ManagedBy;

  @Field({ nullable: true })
  @IsBoolean()
  readonly insertLabelInstructions?: boolean;
}
