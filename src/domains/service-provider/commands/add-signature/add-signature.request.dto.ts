import { AuthRequestDto } from '@app/modules/auth';

export class AddSignatureRequestDto extends AuthRequestDto {
  signature!: string;
}
