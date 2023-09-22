import { Extensions, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsUUID } from 'class-validator';
import { Transaction } from '@app/interfaces/notification/notification.enums';
import { Role } from '@app/modules/auth';

@InputType('NotificationUserSettingsUpdateInput')
export class UpdateUserSettingsRequestDto {
  @Field()
  @IsEmail()
  emailAddress!: string;
}

@InputType('NotificationUserSettingsUpdateAdminInput')
export class UpdateUserSettingsAdminRequestDto extends UpdateUserSettingsRequestDto {
  @IsUUID()
  @Field()
  userId!: string;

  @Field(() => [Transaction])
  @Extensions({ allow: Role.Admin })
  disableTxEmail!: Transaction[];
}
