import { Field, ID, ObjectType } from '@nestjs/graphql';
import { graphqlUtils } from '@app/modules/graphql';

// eslint-disable-next-line no-use-before-define
type ConnectionMonthlyStatEntityConstructor = Omit<VolumeStatEntity, 'id'>;

@ObjectType('VolumeStat')
export class VolumeStatEntity {
  @Field(() => ID)
  id: string;

  @Field()
  startAt: Date;

  @Field()
  endAt: Date;

  @Field()
  receivedMessages: number;

  @Field()
  gatedMessages?: number;

  constructor(props: ConnectionMonthlyStatEntityConstructor) {
    this.startAt = props.startAt;
    this.endAt = props.endAt;
    this.receivedMessages = props.receivedMessages;
    this.gatedMessages = props.gatedMessages;
    this.id = graphqlUtils.encodeCursor(
      `${this.startAt.getTime()}-${this.endAt.getTime()}`,
    );
  }
}
