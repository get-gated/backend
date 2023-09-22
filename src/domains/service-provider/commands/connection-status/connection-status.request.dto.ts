import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { Status } from '@app/interfaces/service-provider/service-provider.enums';

@InputType('ConnectionStatusInput')
export class ConnectionStatusRequestDto {
  @Field()
  @IsUUID()
  connectionId!: string;

  @Field(() => Status)
  @IsEnum(Status)
  status!: Status;
}
