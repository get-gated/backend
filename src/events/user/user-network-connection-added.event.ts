import { Event } from '@app/modules/event-bus';
import { UserNetworkConnectionInterface } from '@app/interfaces/user/user-network-connection.interface';
import { UserInterface } from '@app/interfaces/user/user.interface';

@Event('UserNetworkConnectionAdded')
export class UserNetworkConnectionAddedEvent extends UserNetworkConnectionInterface {
  public readonly gatedUserId?: string;

  public readonly userId: string;

  public readonly gatedUser?: UserInterface;

  public readonly user: UserInterface;

  constructor(message: UserNetworkConnectionAddedEvent) {
    super(message);
    this.gatedUserId = message.gatedUserId;
    this.userId = message.userId;
    this.gatedUser = message.gatedUser;
    this.user = message.user;
  }
}
