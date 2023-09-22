import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import DecisionEntity from '../../entities/decision.entity';

@ObjectType('DecisionEdge')
export class DecisionEdge extends Edge<DecisionEntity> {
  @Field(() => DecisionEntity)
  node: DecisionEntity;

  constructor(props: DecisionEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('DecisionsCollection')
export class DecisionsResponse extends Connection<DecisionEntity> {
  @Field(() => [DecisionEdge])
  edges: DecisionEdge[];

  constructor(props: DecisionsResponse) {
    super(props);
    this.edges = props.edges;
  }
}
