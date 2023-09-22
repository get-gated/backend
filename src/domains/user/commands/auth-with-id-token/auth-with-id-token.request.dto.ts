import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Provider } from '@app/modules/auth';

export class AuthWithIdTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  idToken!: string;

  @IsEnum(Provider)
  @IsNotEmpty()
  provider!: Provider;
}
