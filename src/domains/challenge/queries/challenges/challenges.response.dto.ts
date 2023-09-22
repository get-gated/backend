import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import ChallengeEntity from '../../entities/challenge.entity';

@ObjectType('ChallengeEdge')
export class ChallengeEdge extends Edge<ChallengeEntity> {
  @Field(() => ChallengeEntity)
  node: ChallengeEntity;

  constructor(props: ChallengeEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('ChallengesConnection')
export class ChallengesResponse extends Connection<ChallengeEntity> {
  @Field(() => [ChallengeEdge])
  edges: ChallengeEdge[];

  constructor(props: ChallengesResponse) {
    super(props);
    this.edges = props.edges;
  }
}
