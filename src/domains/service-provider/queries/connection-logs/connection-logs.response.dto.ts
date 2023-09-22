import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import ConnectionLogEntity from '../../entities/connection-log.entity';

@ObjectType('ConnectionLogEdge')
export class ConnectionLogEdge extends Edge<ConnectionLogEntity> {
  @Field(() => ConnectionLogEntity)
  node: ConnectionLogEntity;

  constructor(props: ConnectionLogEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('ConnectionLogsConnection')
export class ConnectionLogsResponse extends Connection<ConnectionLogEntity> {
  @Field(() => [ConnectionLogEdge])
  edges: ConnectionLogEdge[];

  constructor(props: ConnectionLogsResponse) {
    super(props);
    this.edges = props.edges;
  }
}
