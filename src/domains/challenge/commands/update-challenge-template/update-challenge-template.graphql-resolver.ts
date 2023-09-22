import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeTemplateEntity from '../../entities/template.entity';

import { UpdateChallengeTemplateCommand } from './update-challenge-template.command';
import { UpdateChallengeTemplateRequest } from './update-challenge-template.request.dto';

@Resolver()
export class UpdateChallengeTemplateGraphqlResolver {
  constructor(
    private commandBus: CommandBus,
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
  ) {}

  @Mutation(() => ChallengeTemplateEntity)
  @Allow(Role.Admin)
  public async challengeTemplateUpdate(
    @Args('input') args: UpdateChallengeTemplateRequest,
  ): Promise<ChallengeTemplateEntity> {
    await this.commandBus.execute(
      new UpdateChallengeTemplateCommand(
        args.challengeTemplateId,
        args.name,
        args.body,
        args.greetingBlock,
        args.leadBlock,
        args.donateBlock,
        args.expectedBlock,
        args.signatureBlock,
        args.isEnabled ?? true,
      ),
    );
    return this.templateRepo.findOneOrFail(args.challengeTemplateId);
  }
}
