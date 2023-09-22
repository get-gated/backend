import { Role } from '@app/modules/auth';

import { UserPersonalizationInterface } from './user-personalization.interface';

export abstract class UserInterface {
  public readonly userId: string;

  public readonly handle?: string;

  public readonly firstName: string;

  public readonly lastName: string;

  public readonly avatar?: string;

  public readonly referralCode?: string | null;

  public readonly joinedAt: Date;

  public readonly roles: Role[];

  public readonly isSignupCompleted: boolean;

  public readonly isDisabled: boolean;

  public readonly personalization?: UserPersonalizationInterface;

  abstract fullName: string;

  abstract referredByUserId?: string;

  constructor(props: Omit<UserInterface, 'fullName'>) {
    this.userId = props.userId;
    this.handle = props.handle;
    this.firstName = props.firstName;
    this.lastName = props.lastName || '';
    this.joinedAt = new Date(props.joinedAt);
    this.roles = props.roles;
    this.avatar = props.avatar;
    this.isSignupCompleted = props.isSignupCompleted;
    this.personalization = props.personalization;
    this.isDisabled = props.isDisabled;
    this.referralCode = props.referralCode;
  }
}
