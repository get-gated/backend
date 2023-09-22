import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, Edge } from '@app/modules/graphql';
import TxEmailEntity from '../../entities/tx-email.entity';

@ObjectType('NotificationsConnection')
export class NotificationsResponse extends Connection<TxEmailEntity> {
  @Field(() => [NotificationEdge])
  edges: NotificationEdge[];

  constructor(props: NotificationsResponse) {
    super(props);
    this.edges = props.edges;
  }
}

@ObjectType('NotificationEdge')
export class NotificationEdge extends Edge<TxEmailEntity> {
  @Field(() => TxEmailEntity)
  node: TxEmailEntity;

  constructor(props: NotificationEdge) {
    super(props);
    this.node = props.node;
  }
}
