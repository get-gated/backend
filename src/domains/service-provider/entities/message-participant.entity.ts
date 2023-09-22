import { Field, ObjectType } from '@nestjs/graphql';
import { ParticipantInterface } from '@app/interfaces/service-provider/participant.interface';

@ObjectType('MessageParticipant')
export class MessageParticipantEntity implements ParticipantInterface {
  @Field()
  emailAddress!: string;

  @Field({ nullable: true })
  displayName?: string;
}
