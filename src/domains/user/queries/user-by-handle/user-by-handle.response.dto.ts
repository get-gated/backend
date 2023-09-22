export class UserByHandleResponseDto {
  userId!: string;

  handle?: string;

  referralCode?: string | null;

  avatar?: string;

  lastName!: string;

  firstName!: string;

  fullName!: string;
}
