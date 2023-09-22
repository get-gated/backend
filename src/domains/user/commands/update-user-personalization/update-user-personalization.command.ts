import { UserPersonalizationEntity } from '../../entities/personalization.entity';

export class UpdateUserPersonalizationCommand {
  constructor(
    public readonly userId: string,
    public readonly personalization: UserPersonalizationEntity,
  ) {}
}
