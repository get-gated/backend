import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { IGraphqlContext } from '@app/modules/graphql';

import ConnectionEntity from '../../entities/connection.entity';

import { ChangeManagedByRequestDto } from './change-managed-by.request.dto';
import { ChangeManagedByCommand } from './change-managed-by.command';

@Resolver()
export class ChangeManagedByGraphqlResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => ConnectionEntity)
  @Allow(Role.Admin)
  public async connectionManagedBy(
    @Args('input') args: ChangeManagedByRequestDto,
    @Context() { loaders }: IGraphqlContext,
  ): Promise<ConnectionEntity> {
    await this.commandBus.execute(
      new ChangeManagedByCommand(
        args.connectionId,
        args.manageBy,
        args.insertLabelInstructions,
      ),
    );
    return loaders.connection.load(args.connectionId);
  }
}
