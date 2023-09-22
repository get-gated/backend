import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import PatternEntity from '../../entities/pattern.entity';

@ObjectType('PatternsEdge')
export class PatternsEdge extends Edge<PatternEntity> {
  @Field(() => PatternEntity)
  node: PatternEntity;

  constructor(props: PatternsEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('PatternsConnection')
export class PatternsResponse extends Connection<PatternEntity> {
  @Field(() => [PatternsEdge])
  edges!: PatternsEdge[];

  constructor(props: PatternsResponse) {
    super(props);
    this.edges = props.edges;
  }
}
