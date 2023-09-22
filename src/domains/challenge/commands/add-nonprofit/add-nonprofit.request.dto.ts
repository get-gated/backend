import { AuthFieldMiddleware, Role } from '@app/modules/auth';
import { ArgsType, Extensions, Field, InputType } from '@nestjs/graphql';
import {
  IsBase64,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

@InputType('NonprofitAddInput')
@ArgsType()
export class AddNonprofitRequest {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Field()
  name!: string;

  @IsString()
  @Field({ nullable: true })
  description?: string;

  @Extensions({ role: Role.Admin })
  @IsString()
  @Field({ nullable: true, middleware: [AuthFieldMiddleware] })
  externalId?: string;

  @Extensions({ role: Role.Admin })
  @IsString()
  @Field({ nullable: true, middleware: [AuthFieldMiddleware] })
  ein?: string;

  @ValidateIf((o) => o.url)
  @IsUrl()
  @Field({ nullable: true })
  url?: string;

  @IsUUID()
  @Field()
  @IsNotEmpty()
  categoryId!: string;

  @ValidateIf((o) => o.logo.indexOf('http') === 0)
  @IsUrl()
  @ValidateIf((o) => o.logo.indexOf('data') === 0)
  @IsBase64()
  @ValidateIf((e) => e.logo !== '')
  @Field({ nullable: true })
  logo!: string;

  @IsBoolean()
  @Field(() => Boolean)
  isDisplayed = false;
}
