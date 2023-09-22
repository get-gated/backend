import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { Allow, AuthedUser, Role, User } from '@app/modules/auth';
import { QueryBus } from '@nestjs/cqrs';
import { MessageType } from '@app/interfaces/service-provider/service-provider.enums';
import { IGraphqlContext } from '@app/modules/graphql';

import { EvaluateMessageResult } from '../../gatekeeper.service';
import TrainingEntity from '../../entities/training.entity';
import PatternEntity from '../../entities/pattern.entity';

import { EvaluateMessageRequestDto } from './evaluate-message.request.dto';
import { EvaluateMessageResponseDto } from './evaluate-message.response.dto';
import { EvaluateMessageQuery } from './evaluate-message.query';

@Resolver()
export class EvaluateMessageGraphqlResolver {
  constructor(private queryBus: QueryBus) {}

  @Query(() => EvaluateMessageResponseDto)
  @Allow(Role.User)
  async decisionTest(
    @User() { userId }: AuthedUser,
    @Context() { loaders }: IGraphqlContext,
    @Args('input') { address }: EvaluateMessageRequestDto,
  ): Promise<EvaluateMessageResponseDto> {
    const result: EvaluateMessageResult = await this.queryBus.execute(
      new EvaluateMessageQuery({
        type: MessageType.Received,
        from: { emailAddress: address },
        userId,
        messageId: 'test',
        receivedAt: new Date(),
        isMailingList: false,
        to: [],
        cc: [],
        bcc: [],
        replyTo: [],
        connectionId: 'test',
        externalMessageId: 'test',
      }),
    );
    let enforcedTraining: TrainingEntity | undefined;
    let enforcedPattern: PatternEntity | undefined;

    if (result.enforcedPatternId) {
      enforcedPattern = await loaders.pattern.load(result.enforcedPatternId);
    }

    if (result.enforcedTrainingId) {
      enforcedTraining = await loaders.training.load(result.enforcedTrainingId);
    }

    return new EvaluateMessageResponseDto({
      ...result,
      address,
      enforcedTraining,
      enforcedPattern,
    });
  }
}
