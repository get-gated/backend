import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { Allow, Role } from '@app/modules/auth';

import ChallengeConnectionSettingEntity from '../../entities/connection-setting.entity';

import { ConnectionSettingsCommand } from './connection-settings.command';
import { ConnectionSettingsRequest } from './connection-settings.request.dto';

@Resolver()
export class ConnectionSettingsGraphqlResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => ChallengeConnectionSettingEntity)
  @Allow(Role.Admin)
  async challengeConnectionSettingsUpdate(
    @Args('input') input: ConnectionSettingsRequest,
  ): Promise<unknown> {
    return this.commandBus.execute(
      new ConnectionSettingsCommand(
        input.connectionId,
        input.userId,
        input.mode,
        input.templateId,
        input.greetingBlock,
        input.leadBlock,
        input.donateBlock,
        input.expectedBlock,
        input.signatureBlock,
      ),
    );
  }
}
