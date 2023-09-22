import { Role } from '@app/modules/auth';

export class UpdateUserRolesCommand {
  constructor(public readonly userId: string, public readonly roles: Role[]) {}
}
