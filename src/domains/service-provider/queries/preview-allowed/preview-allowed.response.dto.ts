import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Rule } from '@app/interfaces/gatekeeper/gatekeeper.enums';

import { MessageParticipantEntity } from '../../entities/message-participant.entity';

@ObjectType()
export class PreviewAllowedSender {
  @Field(() => ID)
  id!: string;

  @Field()
  sender!: MessageParticipantEntity;

  @Field(() => Rule)
  rule!: Rule;
}

@ObjectType()
export class PreviewAllowedResponse {
  @Field(() => [PreviewAllowedSender])
  results!: PreviewAllowedSender[];
}
