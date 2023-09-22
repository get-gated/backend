import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeTemplateEntity from '../../entities/template.entity';

import { ToggleChallengeTemplateCommand } from './toggle-challenge-template.command';
import { ToggleChallengeTemplateRequest } from './toggle-challenge-template.request.dto';

@Resolver()
export class ToggleChallengeTemplateGraphqlResolver {
  constructor(
    private commandBus: CommandBus,
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
  ) {}

  @Mutation(() => ChallengeTemplateEntity)
  @Allow(Role.Admin)
  public async challengeTemplateToggle(
    @Args('input') args: ToggleChallengeTemplateRequest,
  ): Promise<ChallengeTemplateEntity> {
    await this.commandBus.execute(
      new ToggleChallengeTemplateCommand(
        args.challengeTemplateId,
        args.isEnabled,
      ),
    );
    return this.templateRepo.findOneOrFail(args.challengeTemplateId);
  }
}
