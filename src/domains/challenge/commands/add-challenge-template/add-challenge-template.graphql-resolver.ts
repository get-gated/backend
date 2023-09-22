import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Role } from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import ChallengeTemplateEntity from '../../entities/template.entity';

import { AddChallengeTemplateCommand } from './add-challenge-template.command';
import { AddChallengeTemplateRequest } from './add-challenge-template.request.dto';

@Resolver()
export class AddChallengeTemplateGraphqlResolver {
  constructor(
    private commandBus: CommandBus,
    @InjectRepository(ChallengeTemplateEntity)
    private templateRepo: EntityRepository<ChallengeTemplateEntity>,
  ) {}

  @Mutation(() => ChallengeTemplateEntity)
  @Allow(Role.Admin)
  public async challengeTemplateAdd(
    @Args('input') args: AddChallengeTemplateRequest,
  ): Promise<ChallengeTemplateEntity | null> {
    const nonprofitId = await this.commandBus.execute(
      new AddChallengeTemplateCommand(
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
    return this.templateRepo.findOne(nonprofitId);
  }
}
