import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';

import UserNetworkConnectionEntity from '../../entities/network-connection.entity';

@ObjectType('NetworkConnectionEdge')
export class NetworkConnectionEdge extends Edge<UserNetworkConnectionEntity> {
  @Field(() => UserNetworkConnectionEntity)
  node: UserNetworkConnectionEntity;

  constructor(props: NetworkConnectionEdge) {
    super(props);
    this.node = props.node;
  }
}

@ObjectType('NetworkConnectionsConnection')
export class NetworkConnectionsResponseDto extends Connection<UserNetworkConnectionEntity> {
  @Field(() => [NetworkConnectionEdge])
  edges: NetworkConnectionEdge[];

  constructor(props: NetworkConnectionsResponseDto) {
    super(props);
    this.edges = props.edges;
  }
}
