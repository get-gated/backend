import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Provider } from '@app/modules/auth';

export class AuthRequestDto {
  @IsEnum(Provider)
  @IsNotEmpty()
  readonly provider!: Provider;

  @IsString()
  @IsOptional()
  readonly clientState!: string;

  @IsString()
  @IsNotEmpty()
  readonly redirect!: string;

  @IsString()
  @IsOptional()
  readonly loginHint!: string;

  @IsUUID()
  @IsOptional()
  readonly defaultNonprofitId?: string;
}
