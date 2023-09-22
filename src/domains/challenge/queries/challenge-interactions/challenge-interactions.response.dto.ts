import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';

@ObjectType('ChallengeInteractionEdge')
export class ChallengeInteractionEdge extends Edge<ChallengeInteractionEntity> {
  @Field(() => ChallengeInteractionEntity)
  node: ChallengeInteractionEntity;

  constructor(props: ChallengeInteractionEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('ChallengeInteractionsConnection')
export class ChallengeInteractionsResponse extends Connection<ChallengeInteractionEntity> {
  @Field(() => [ChallengeInteractionEdge])
  edges: ChallengeInteractionEdge[];

  constructor(props: ChallengeInteractionsResponse) {
    super(props);
    this.edges = props.edges;
  }
}
