import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import TrainingEntity from '../../entities/training.entity';

@ObjectType('TrainingEdge')
export class TrainingEdge extends Edge<TrainingEntity> {
  @Field(() => TrainingEntity)
  node: TrainingEntity;

  constructor(props: TrainingEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('TrainingsConnection')
export class SearchTrainingsResponse extends Connection<TrainingEntity> {
  @Field(() => [TrainingEdge])
  edges: TrainingEdge[];

  constructor(props: SearchTrainingsResponse) {
    super(props);
    this.edges = props.edges;
  }
}
